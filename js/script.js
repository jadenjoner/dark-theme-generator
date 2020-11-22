function $(query) {
  var result = document.querySelector(query);

  result.styles = function(styles) {
    for (var style in styles) {
      result.style[style] = styles[style];
    }
  };

  return result;
}

function $$(query) {
  var result = document.querySelectorAll(query);

  result.styles = function(styles) {
    for (var el = 0; el < result.length; el++) {
      for (var style in styles) {
        result[el].style[style] = styles[style];
      }
    }
  };

  return result;
}

function safeEval(str){
  var match = str.match(/(([^+-\=\*\/\%\|\<\>\! ])( +)?\(|=>|[^=!<>]=[^=])/);
  return match==null ? str :
  console.error(`Safe Eval Error: js function execution or variable manipulation detected in safe mode "${match[0]}" in "${str}"
`) || null;
}

function etp(input, custom){
  while(input.match(/\{(.+?)\}/)){
    var match = input.match(/\{(.+?)\}/)
    if(custom){
      var result = '(()=>{var ['+Object.keys(custom).toString()+'] = ['+Object.values(custom).toString()+'];return '+match[1]+'})()'
      input = input.replace(match[0], eval(result) || '')
    }
    else input = input.replace(match[0], eval(match[1]) || '')
  }
  return input;
}

function get(url, func, init = false) {
  var xmlhttp = new XMLHttpRequest();

  xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      if (init)
        func(init(this.responseText));
      else
        func(this.responseText);
      }
    };

  xmlhttp.open("GET", url, true);
  xmlhttp.send();
}



const formData = [
  {
    type: 'input-text',
    name: 'theme_name',
    label: 'Theme Name',
    placeholder: 'My theme',
  },
  {
    type: 'title',
    value: 'Colors'
  },
  {
    type: 'color',
    name: 'color_main',
    label: 'Main Theme Color',
    short: '55-75 saturation 70-100 brighness value',
    value: '#d95448'
  },
  {
    type: 'color',
    name: 'color_secondary',
    label: 'Secondary or interactive Color',
    value: '#4893d9'
  },
  {
    type: 'color',
    name: 'color_black0',
    label: 'Black Darker',
    short: '8-14 brightness value',
    value: '#15151e'
  },
  {
    type: 'color',
    name: 'color_black1',
    label: 'Black Lighter',
    short: '20-30 brightness value',
    value: '#353447'
  },
  {
    type: 'color',
    name: 'color_white0',
    label: 'White Lighter',
    short: '85-95 brightness value',
    value: '#e5d9c5'
  },
  {
    type: 'color',
    name: 'color_white1',
    label: 'White Darker',
    short: '70-80 brightness value',
    value: '#c6bda7'
  },
  {
    type: 'title',
    value: 'Borders',
  },
  {
    type: 'number',
    name: 'border_radius0',
    label: 'Border Radius Small (px)',
    value: 4,
  },
  {
    type: 'number',
    name: 'border_radius1',
    label: 'Border Radius Large (px)',
    value: 8,
  },
  {
    type: 'number',
    name: 'border_width',
    label: 'Border Width (px)',
    value: 2,
  },


  {
    type: 'title',
    value: 'Other'
  },
  {
    type: 'number',
    name: 'transition_time',
    label: 'Transition speed (seconds)',
    value: 0.2
  },
  {
    type: 'button',
    value: 'Submit',
    action: 'submit()',
  }
]

$('#content').innerHTML = formData.reduce((a, obj) => {
  switch(obj.type){
    case 'input-text': a+=
      `<label>${obj.label}</label><input id="${obj.name}" type="text" placeholder="${obj.placeholder}" value="${obj.value||''}">`; break;
    case 'title': a+=
      `<h2>${obj.value}</h2>`;break;
    case 'color': a+=
      `<label>${obj.label}</label>
      <p class="short">${obj.short}</p>
      <div class="color-wrap"><input class="reset-input" id="${obj.name}" style="width:220px" placeholder="#XXXXXX" value="${obj.value}" type="text" onkeyup="$('#${obj.name}-inputbox').value = this.value">
      <input id="${obj.name}-inputbox" value="${obj.value}" type="color" onchange="$('#${obj.name}').value = this.value"></div>`;break;
    case 'number': a+=
      `<label>${obj.label}</label>
      <input type="text" placeholder="###" id="${obj.name}" style="width:100px" value="${obj.value}">`;break;
    case 'button': a+=
      `<br><button onclick="${obj.action}">${obj.value}</button>`;break;
  }
  return a+"<div><br></div>";
}, '')

var templateSass = `// Theme {a.theme_name}

// Options (you can change these)

$theme: {a.color_main};
$theme-secondary: {a.color_secondary};
$black-darker: {a.color_black0};
$black-lighter: {a.color_black1};
$white-lighter: {a.color_white0};
$white-darker: {a.color_white1};
$border-width: {a.border_width}px;
$border-radius1: {a.border_radius0}px;
$border-radius2: {a.border_radius1}px;
$transition-time: {a.transition_time}s;

// Variables (try not to use fixed values here)

$theme-dark: saturate(darken($theme, 5%), 5%);
$theme-bright: desaturate(lighten($theme, 5%), 5%);

$theme2: $theme-secondary;
$theme2-dark: saturate(darken($theme2, 5%), 5%);
$theme2-bright: desaturate(lighten($theme2, 5%), 5%);

$theme-red: adjust-hue($theme, - hue($theme) );
$theme-yellow: adjust-hue($theme, - hue($theme) + 60deg);
$theme-green: adjust-hue($theme, - hue($theme) + 120deg);
$theme-blue: adjust-hue($theme, - hue($theme) + 240deg);

$black1: $black-darker;
$black4: $black-lighter;
$black2: mix($black1, $black4, 75%);
$black3: mix($black1, $black4, 25%);
$black0: saturate(darken($black1, 5%), 5%);
$black5: mix($black1, $white-lighter, 80%);

$white1: $white-lighter;
$white4: $white-darker;
$white2: mix($white1, $white4, 75%);
$white3: mix($white1, $white4, 25%);
$white0: desaturate(lighten($white1, 5%), 5%);

$border-radius0: $border_radius1 / 2;
$border-radius3: $border_radius2 * 2;`;

var template = `
<h2>Your {a.theme_name} Theme Varables</h2>
<p>After you modify the output to your liking (when you change the text below it will update the theme), copy and paste into a new theme files like {a.theme_name.replace(/ /g, '-') || 'theme-name'}.scss</p>
<p>Then put <code>@import '{a.theme_name.replace(/ /g, '-') || 'theme-name'}.scss'</code> in your main sass file where you will be able to use the varables.</p>
<p>You could also just put the following text at the top of your scss file</p>
<button onclick="$('textarea').select();document.execCommand('copy');">Copy Result</button>
<button onclick="location.reload()">New Theme</button>
<br><br>
<textarea onkeyup="updateTheme()">${templateSass}</textarea><br>`;


var sass = new Sass();


function submit() {
  var result = {};
  formData.forEach(obj => {
    if(obj.name)
    result[obj.name] = $('#'+obj.name).value;
  })
  console.log(result);
  a = result;
  theme = etp(template)
  $('#content').innerHTML = theme
  window.scrollTo(0, 0)

  get('css/style.scss', (text) => {
    text = text.replace(/.+\n/, '');
    text = etp(templateSass) + text;

    sass.compile(text, (result) => {
      $('#themer').outerHTML = '';
      var styleSheet = document.createElement("style")
      styleSheet.type = "text/css"
      styleSheet.innerText = result.text
      document.head.appendChild(styleSheet)
    });
  })
}

function updateTheme() {
  get('css/style.scss', (text) => {
    text = text.replace(/.+\n/, '');
    text = etp($('textarea').value) + text;

    sass.compile(text, (result) => {
      var styleSheet = document.createElement("style")
      styleSheet.type = "text/css"
      styleSheet.innerText = result.text
      document.head.appendChild(styleSheet)
    });
  })
}
