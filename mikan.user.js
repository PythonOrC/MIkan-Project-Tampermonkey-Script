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
// @grant           GM_xmlhttpRequest
// @grant           GM_setValue
// @grant           GM_getValue
// ==/UserScript==

(function () {
  ("use strict");
  const path = window.location.pathname;
  const homepage = ["/", "/Home"];
  const detailpage = ["/Home/Bangumi/"];

  GM_addStyle(`
    /* The switch - the box around the slider */
    
    .custom-view-side-info {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      width: 150px;
      height: 100%;
    }
    
    .custom-view-side-info .spacer {
      height: 5px; /* Adjust the height to control the spacing */
    }
    
    .custom-view-icon {
      vertical-align: middle; 
      width: 16px; 
      height: 16px; 
      margin-right: 8px;}
      
      .custom-view-li {
        height: 275px !important; 
      }
    .custom-view-an-info {
      height: 50px !important;
      display: flex;
      justify-content: space-between;
    }

    .custom-view-title-jp {
      font-size: 10px;
      color: rgb(153, 153, 153);
    }

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
    const apis = {
      myanimelist: {
        client_id: "CLIENT_ID",
        client_secret: "CLIENT_SECRET",
        method: "GET",
        url: "https://api.myanimelist.net/v2/anime",
        search_param: "q",
        fixed_params: {
          fields: "mean,popularity",
          nsfw: "true",
          limit: "1",
        },
        fixed_headers: { accept: "application/json" },
        id_key: "X-MAL-CLIENT-ID",
        id_value: "client_id",
      },
      bangumitv: {
        client_id: "CLIENT_ID",
        client_secret: "CLIENT_SECRET",
        method: "GET",
        url: "https://api.bgm.tv/search/subject/",
        search_param: "",
        fixed_params: { type: "2", responseGroup: "large", max_results: "1" },
        fixed_headers: { accept: "application/json" },
        id_key: "",
        id_value: "",
      },
    };
    const anime_entries = hp_getAnimeTitles();

    const anime_div = document.createElement("div");
    anime_div.classList.add("sk-bangumi", "toggle-element", "normally-hidden");
    anime_div.style.display = "none";
    anime_div.id = "custom-view-div";
    anime_div.innerHTML = hp_getTableFull(anime_entries);
    hp_set_visibility();
    // add anime-div after the svg element in the div#sk-body
    document
      .getElementById("sk-body")
      .insertBefore(anime_div, document.querySelector(".sk-bangumi"));

    hp_updateScore(apis, anime_entries);
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

    console.log("Attaching sort listener");
    document
      .getElementById("sort-dropdown")
      .querySelectorAll("a")
      .forEach((sort_option) => {
        sort_option.addEventListener("click", function () {
          const criteria = this.getAttribute("data-criteria");
          const reverse = this.getAttribute("data-reverse") === "true";
          hp_sortTable(anime_entries, criteria, reverse);
          hp_updateAnimeDiv(anime_entries);
        });
      });
  }

  function hp_sortTable(anime_entries, criteria, reverse) {
    console.log("Sorting by", criteria, "in", reverse ? "reverse" : "normal");
    const order = reverse ? -1 : 1;
    anime_entries.sort((a, b) => {
      switch (criteria) {
        case "score":
          if (a.mal_score === b.mal_score) {
            return a.title.localeCompare(b.title) * order;
          }
          return (a.mal_score - b.mal_score) * -order;
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

  function hp_updateAnimeDiv(anime_entries) {
    document.querySelectorAll(".custom-an-box").forEach((el) => {
      el.remove();
    });
    const anime_div = document.getElementById("custom-view-div");
    anime_div.insertAdjacentHTML(
      "beforeend",
      hp_getTableContent(anime_entries)
    );
  }

  function hp_getTableFull(entries) {
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

    tableHtml += hp_getTableContent(entries);
    return tableHtml;
  }

  function hp_getTableContent(entries) {
    let tableHtml = `
      <div class="an-box animated fadeIn custom-an-box">
        <ul class="list-inline an-ul">`;

    for (let i = 0; i < entries.length; i++) {
      if (i > 0 && i % 5 === 0) {
        tableHtml += `
        </ul>
      </div>
      <div class="an-box animated fadeIn custom-an-box">
        <ul class="list-inline an-ul">`;
      }

      tableHtml += entries[i].html;
    }

    tableHtml += `
        </ul>
      </div>`;
    return tableHtml;
  }

  // function that filters out all anime titles
  function hp_getAnimeTitles() {
    const animeTitles = [];
    // find all the links to anime titles
    for (const entry_row of document.querySelectorAll("ul.list-inline.an-ul")) {
      // find all li elements
      for (const original_entry of entry_row.querySelectorAll("li")) {
        // make a copy of the entry
        let entry = original_entry.cloneNode(true);

        // this is now individual anime titles
        const span = entry.querySelector("span");
        span.classList.remove("b-lazy");
        span.classList.add("b-loaded");
        const subscribeDiv = entry.querySelector(
          "div.an-info-icon.js-subscribe_bangumi"
        );
        if (subscribeDiv) {
          subscribeDiv.remove();
        }

        entry.classList.add("custom-view-li");

        const an_info_div = entry.querySelector("div.an-info");
        an_info_div.classList.add("custom-view-an-info");

        const side_info_div = document.createElement("div");
        side_info_div.classList.add("custom-view-side-info");
        side_info_div.innerHTML = `
          <div>
            <img src="https://bgm.tv/img/favicon.ico" alt="BGM" class="custom-view-icon">
            <span class="bgm-score"></span>
          </div>
          <div class="spacer"></div>
          <div>
            <img src="https://cdn.myanimelist.net/images/favicon.ico" alt="MAL" class="custom-view-icon">
            <span class="mal-score"></span>
          </div>
          `;
        //TODO: maybe consider adding popularity? <div>Popularity: <span class="mal-popularity">107k</span></div>
        an_info_div.appendChild(side_info_div);

        const title_jp_div = document.createElement("div");
        title_jp_div.classList.add("custom-view-title-jp");
        // add the title_jp div to the entry
        entry.querySelector("div.an-info-group").appendChild(title_jp_div);

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

  async function hp_updateScore(apis, entries) {
    // Loop over entries one by one
    for (const entry of entries) {
      console.log(entry.title);
      if (false) {
        try {
          const bgmtv = await hp_callAPI(apis.bangumitv, entry.title);
          entry.bgmtv_score = bgmtv.list[0].rating.score;
          entry.title_jp = bgmtv.list[0].name;
          try {
            const mal = await hp_callAPI(apis.myanimelist, entry.title_jp);
            entry.mal_score = mal.data[0].node.mean;
            entry.mal_popularity = mal.data[0].node.popularity;
          } catch (e) {
            console.error("MAL:", e);
          }
        } catch (e) {
          console.error("BGM.TV:", e);
        }
        // check if the entry has been updated
        if (entry.bgmtv_score === undefined) entry.bgmtv_score = 0.0;
        if (entry.title_jp === undefined) entry.title_jp = "";
        if (entry.mal_score === undefined) entry.mal_score = 0.0;
        if (entry.mal_popularity === undefined) entry.mal_popularity = 0;
      } else {
        //* populate anime_entires with fake data for testing purposes
        entry.title_jp = "日本語タイトル";
        // keep two decimal places
        entry.bgmtv_score = Math.floor(Math.random() * 1000) / 100;
        entry.mal_score = Math.floor(Math.random() * 1000) / 100;

        entry.mal_popularity = Math.floor(Math.random() * 1000);
        await new Promise((resolve) => setTimeout(resolve, 200));
      }
      console.log(entry);
      // Update the DOM right after processing this entry

      hp_updateEntryHTML(entry);
    }
    hp_updateAnimeDiv(entries);
  }

  function hp_updateEntryHTML(entry) {
    const curr_entry_html = document.createElement("div");
    curr_entry_html.innerHTML = entry.html;

    // Find the element to update
    curr_entry_html.querySelector("div.custom-view-title-jp").textContent =
      entry.title_jp;

    curr_entry_html.querySelector("span.bgm-score").textContent =
      entry.bgmtv_score;
    curr_entry_html.querySelector("span.mal-score").textContent =
      entry.mal_score;
    // Update the entry HTML with the modified content
    entry.html = curr_entry_html.innerHTML;
  }

  function hp_callAPI(api, title) {
    // create the header for the request
    // id_key if it exists, otherwise an empty object
    const headers = {
      ...(api.id_key && { [api.id_key]: api[api.id_value] }),
      ...api.fixed_headers,
    };

    let url = api.url;
    const enc_title = encodeURIComponent(title);
    if (api.search_param) {
      url += `?${api.search_param}=${enc_title}`;
    } else {
      url += `${enc_title}?`;
    }
    // for each fixed parameter, add it to the url
    for (const [key, value] of Object.entries(api.fixed_params)) {
      url += `&${key}=${value}`;
    }
    console.log(url);
    console.log(headers);

    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: api.method,
        url: url,
        headers: headers,
        onload: function (response) {
          if (response.status != 200) {
            reject(response.statusText);
          }
          try {
            const data = JSON.parse(response.responseText);
            resolve(data);
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
