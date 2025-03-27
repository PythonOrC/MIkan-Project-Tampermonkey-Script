// ==UserScript==
// @name            Mikan Project Enhancer
// @namespace       https://github.com/PythonOrC/
// @version         0.0.1
// @author          PythonOrC
// @description     Adds various features for the Mikan Project website.
// @license         GNU-3.0
// @icon            https://mikanani.me/images/favicon.ico
// @supportURL      https://google.com
// @match           https://mikanani.me/Home/Bangumi/*
// @match           https://mikanime.tv/Home/Bangumi/*
// @match           https://mikanani.me/*
// @match           https://mikanime.tv/*
// @grant           GM_addStyle
// ==/UserScript==

(function () {
  ("use strict");
  const path = window.location.pathname;
  const homepage = ["/", "/Home"];
  const detailpage = ["/Home/Bangumi/"];

  GM_addStyle(`
    /* The switch - the box around the slider */
    #data-row-99 {
      border-left-color: rgb(255,192,203);
      border-left-width: 3px;
      border-left-style: solid;
      font-size: 14px;
      margin-bottom: -15px;
      margin-left: -40px;
      margin-top: 5px;
      padding-left: 37px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .view-toggle {
      display: flex;
      align-items: center;
      margin-top: 3em; /* Adjust vertical spacing as needed */
    }
    .switch {
      position: relative;
      display: inline-block;
      width: 45px;
      height: 25px;
    }

    /* Hide default HTML checkbox */
    .switch input {
      opacity: 0;
      width: 0;
      height: 0;
    }

    /* The slider */
    .slider {
      position: absolute;
      cursor: pointer;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: #ccc;
      -webkit-transition: .4s;
      transition: .4s;
    }

    .slider:before {
      position: absolute;
      content: "";
      height: 19px;
      width: 19px;
      left: 3px;
      bottom: 3px;
      background-color: white;
      -webkit-transition: .4s;
      transition: .4s;
    }

    input:checked + .slider {
      background-color: #2196F3;
    }

    input:focus + .slider {
      box-shadow: 0 0 1px #2196F3;
    }

    input:checked + .slider:before {
      -webkit-transform: translateX(19px);
      -ms-transform: translateX(19px);
      transform: translateX(19px);
    }

    /* Rounded sliders */
    .slider.round {
      border-radius: 25px;
    }

    .slider.round:before {
      border-radius: 50%;
    }
  `);

  window.addEventListener("load", function () {
    if (detailpage.some((item) => path.startsWith(item))) {
      detailPageFunction();
    } else if (homepage.some((item) => path.startsWith(item))) {
      homePageFunction();
    } else {
      console.log('No function for the page: "' + path + '"');
    }
  });

  // function for the home page
  function homePageFunction() {
    const anime_entries = hp_getAnimeTitles();
    const anime_div = document.createElement("div");
    const tmdb_search =
      "https://www.themoviedb.org/search?language=zh-CN&query=";
    const mal_search = "https://myanimelist.net/search/all?q=";
    const bangumitv_search = "https://bangumi.tv/subject_search/";
    anime_div.classList.add("sk-bangumi", "toggle-element", "normally-hidden");
    anime_div.style.display = "none";
    anime_div.innerHTML = hp_getTable(anime_entries);
    hp_set_visibility();
    // add anime-div after the svg element in the div#sk-body
    document
      .getElementById("sk-body")
      .insertBefore(anime_div, document.querySelector(".sk-bangumi"));

    const display_toggle = document.createElement("div");

    display_toggle.classList.add("view-toggle");
    display_toggle.innerHTML = `
      <span style="margin-right:1em;">标准</span>
      <label class="switch">
        <input type="checkbox">
        <span class="slider round"></span>
      </label>
      <span style="margin-left:1em;">自定义</span>
    `;
    document
      .getElementById("sk-body")
      .insertBefore(display_toggle, document.querySelector(".sk-bangumi"));
    display_toggle.addEventListener("change", function () {
      // Select all elements you want to toggle
      document.querySelectorAll(".toggle-element").forEach((el) => {
        el.style.display = el.style.display === "none" ? "" : "none";
      });
    });

    attachSortListener(anime_entries, anime_div);
  }

  function attachSortListener(anime_entries, anime_div) {
    document
      .getElementById("sort-dropdown")
      .querySelectorAll("a")
      .forEach((sort_option) => {
        sort_option.addEventListener("click", function () {
          const criteria = this.getAttribute("data-criteria");
          const reverse = this.getAttribute("data-reverse") === "true";
          hp_sortTable(anime_entries, criteria, reverse);
          anime_div.innerHTML = hp_getTable(anime_entries);
          attachSortListener(anime_entries, anime_div);
        });
      });
  }

  function hp_sortTable(anime_entries, criteria, reverse) {
    order = reverse ? -1 : 1;
    anime_entries.sort((a, b) => {
      switch (criteria) {
        case "score":
          if (a.score === b.score) {
            return a.title.localeCompare(b.title) * order;
          }
          return (a.score - b.score) * order;
        case "date":
          if (a.date === b.date) {
            return a.title.localeCompare(b.title) * order;
          }
          return a.date.localeCompare(b.date) * order;
        case "title":
          return a.title.localeCompare(b.title) * order;
        default:
          return;
      }
    });
  }

  function hp_set_visibility() {
    document.querySelectorAll(".sk-bangumi").forEach((el) => {
      el.classList.add("toggle-element", "normally-shown");
      el.style.display = "";
    });
    document.querySelectorAll(".list-inline.data-nav-ul").forEach((el) => {
      el.classList.add("toggle-element", "normally-shown");
      el.style.display = "";
    });
    document.querySelectorAll(".navbar-nav.date-select").forEach((el) => {
      el.style.cssFloat = "right";
      el.style.paddingRight = "0.68%";
    });
  }

  function hp_getTable(entries) {
    let order = 1;
    let tableHtml = `
      <div id = "data-row-99">
        全部
        <ul id="sort-dropdown" class="navbar-nav">
          <li class="sk-col dropdown">
            <div id="sort-by" class="dropdown-toggle btn btn-default dropdown-custom" data-toggle="dropdown">
              <div class="sk-col"> 排序 <span class="caret"></span></div>
            </div>
            <ul class="dropdown-menu" role="menu">
              <li><a href="#" data-criteria="score"  data-reverse="false">评分：正序</a></li>
              <li><a href="#" data-criteria="score"  data-reverse="true">评分：逆序</a></li>
              <li><a href="#" data-criteria="title"  data-reverse="false">标题：正序</a></li>
              <li><a href="#" data-criteria="title"  data-reverse="true">标题：逆序</a></li>
              <li><a href="#" data-criteria="date"  data-reverse="false">日期：正序</a></li>
              <li><a href="#" data-criteria="date"  data-reverse="true">日期：逆序</a></li>
            </ul>
          </li>
        </ul>
      </div>`;

    for (let i = 0; i < entries.length; i++) {
      if (i % 5 == 0) {
        tableHtml += `</ul></div><div class="row an-res-row-frame" style="display:none;"></div><div class="an-box animated fadeIn"><ul class="list-inline an-ul">`;
      }
      tableHtml += entries[i].html;
    }

    tableHtml += `</ul></div>`;
    return tableHtml;
  }

  // function that filters out all anime titles
  function hp_getAnimeTitles() {
    const animeTitles = [];
    // find all the links to anime titles
    for (const entry_row of document.querySelectorAll("ul.list-inline.an-ul")) {
      // find all li elements
      for (const entry of entry_row.querySelectorAll("li")) {
        // this is now individual anime titles
        const span = entry.querySelector("span");
        span.classList.remove("b-lazy");
        span.classList.add("b-loaded");

        const dataSrc = span.getAttribute("data-src");
        if (dataSrc) {
          span.style.backgroundImage = `url("${dataSrc}")`;
          span.removeAttribute("data-src");
        }
        const date_text = entry.querySelectorAll("div.date-text");
        let date = "9999-12-31";
        let title = "";
        let link = "";
        let available = true;
        // check if there is an entry for this anime
        if (!entry.querySelector("a.an-text")) {
          date = date_text[0].textContent.replace(/\//g, "-");
          title = date_text[1].textContent;
          available = false;
        } else {
          title = entry.querySelector("a.an-text").textContent;
          link = entry.querySelector("a.an-text").href;
        }
        animeTitles.push({
          title,
          link,
          date,
          available,
          html: entry.outerHTML,
        });
      }
    }
    return animeTitles;
  }

  function hp_fetchScore(link, title) {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: "GET",
        url: `https://api.example.com/anime/${animeId}/score`, // Replace with the real API URL
        onload: function (response) {
          try {
            const data = JSON.parse(response.responseText);
            resolve(data.score);
          } catch (e) {
            reject(e);
          }
        },
        onerror: function (err) {
          reject(err);
        },
      });
    });
  }

  // function for the detail page
  function detailPageFunction() {
    console.log("Detail Page");
    alert("Detail Page");
  }
})();
