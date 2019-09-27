window.addEventListener(windowLoad, function() {
  var pivot = document.getElementById('pivot'),
    keys = ['6a47dd8c0c70906c', 'dc203fba39f6674e'],
    lang = MT.utiles.lang.get(),
    loc = localStorage.getItem('livet_clima_ubic') || '/q/zmw:00000.1.85682';
  
  asyncXHR('http://api.wunderground.com/api/'+ keys[Math.floor(Math.random() * keys.length)] +'/conditions/forecast7day/hourly/lang:'+ lang + loc +'.json')
  .then(convertir)
  .spread(procesar)
  .then(getRadar)
  .done(function() {
    document.dispatchEvent(new CustomEvent('appCargada'));
  });

  var condicion = {
    get: function(i) {
      //var hora = i.FCTTIME.hour || new Date().getHours();
      return this[i.icon][i.FCTTIME.hour > 6 && i.FCTTIME.hour < 20 ? 0 : 1]
    },
    'sunny': [1,33, 'http://lh6.ggpht.com/3woQAO5UokS_BS0RwfIp1wVPEaUpmvcULUSFcEuLOJAC2fGjP_hH0XOg3au5sDQUSmwcfg4DaYVTTBJmN69a'],
    'clear': [1,33, 'http://lh6.ggpht.com/3woQAO5UokS_BS0RwfIp1wVPEaUpmvcULUSFcEuLOJAC2fGjP_hH0XOg3au5sDQUSmwcfg4DaYVTTBJmN69a'],
    'mostly_sunny': [3,34, 'http://lh6.ggpht.com/3woQAO5UokS_BS0RwfIp1wVPEaUpmvcULUSFcEuLOJAC2fGjP_hH0XOg3au5sDQUSmwcfg4DaYVTTBJmN69a'],
    'mostlysunny': [3,34, 'http://lh6.ggpht.com/3woQAO5UokS_BS0RwfIp1wVPEaUpmvcULUSFcEuLOJAC2fGjP_hH0XOg3au5sDQUSmwcfg4DaYVTTBJmN69a'],
    'partlycloudy': [4,36, 'http://lh5.ggpht.com/pJHWZvwKfRRfnE3B7fWuXWO08KsJp4WRuznRPOMRj3ukt5MLtxJvmVRJZRSg-yzliVB-cCxhb4gFwXT6TnM'],
    'partly_cloudy': [4,36, 'http://lh5.ggpht.com/pJHWZvwKfRRfnE3B7fWuXWO08KsJp4WRuznRPOMRj3ukt5MLtxJvmVRJZRSg-yzliVB-cCxhb4gFwXT6TnM'],
    'partlysunny': [4,36, 'http://lh6.ggpht.com9Nv9E7Id1PKMkMS_Iau6R-OWSXlQpMCs-Gp7PR5edQ10POdApbFfSRNyNo2ApPgPfRNUCDgHN9oF9EWRuDk'],
    'mostly_cloudy': [6,38, 'http://lh6.ggpht.com9Nv9E7Id1PKMkMS_Iau6R-OWSXlQpMCs-Gp7PR5edQ10POdApbFfSRNyNo2ApPgPfRNUCDgHN9oF9EWRuDk'],
    'mostlycloudy': [6,38, 'http://lh4.ggpht.com/WRHlhFbogGcI5IGlt8Z_GEEnYDEXVp6E53W8SDqAefYaWigbN0uR4q5TogT4OyDGNGJPNkOrQj4nRZZnYUE'],
    'cloudy': [7,7, 'http://lh4.ggpht.com/WRHlhFbogGcI5IGlt8Z_GEEnYDEXVp6E53W8SDqAefYaWigbN0uR4q5TogT4OyDGNGJPNkOrQj4nRZZnYUE'],
    'rain': [12,12, 'http://lh3.ggpht.com/_u3jcgz-Tk1wWRROL8VWLR6sOfnrtEGn0FI_ntyMA2_Z13kZvgQhvFqh8q1LZlpFp27Zx1apOjBgGpv1Bg'],
    'storm': [13,13, 'http://lh3.ggpht.com/_u3jcgz-Tk1wWRROL8VWLR6sOfnrtEGn0FI_ntyMA2_Z13kZvgQhvFqh8q1LZlpFp27Zx1apOjBgGpv1Bg'],
    'thunderstorm': [15,15, 'http://lh4.ggpht.com/deZqTwrOaDGk8DxTBcEY_hZOm9Ze4qG-jEF2_N7HalsfWUiNFGk_52cge8_L3LxMQ0W47o17ofFyNeYpkA'],
    'tstorms': [15,15, 'http://lh4.ggpht.com/deZqTwrOaDGk8DxTBcEY_hZOm9Ze4qG-jEF2_N7HalsfWUiNFGk_52cge8_L3LxMQ0W47o17ofFyNeYpkA'],
    'snow': [22,22, 'http://lh6.ggpht.com/0AY-PZ1AfXkrieUqx7hQA7SxAMT26TCHkAYJBjCgNuV3623gmGLo0T8ADoW8kAZeUtVQpGK_wtA32jReWw'],
    'sleet': [19,19, 'http://lh6.ggpht.com/0AY-PZ1AfXkrieUqx7hQA7SxAMT26TCHkAYJBjCgNuV3623gmGLo0T8ADoW8kAZeUtVQpGK_wtA32jReWw'],
    'flurries': [26,26, 'http://lh6.ggpht.com/0AY-PZ1AfXkrieUqx7hQA7SxAMT26TCHkAYJBjCgNuV3623gmGLo0T8ADoW8kAZeUtVQpGK_wtA32jReWw'],
    'icy': [19,19, 'http://lh6.ggpht.com/0AY-PZ1AfXkrieUqx7hQA7SxAMT26TCHkAYJBjCgNuV3623gmGLo0T8ADoW8kAZeUtVQpGK_wtA32jReWw'],
    'fog': [11,11, 'http://lh5.ggpht.com/CazEBo3iixH30MZQCgw-9-pt-kuCvheOHFp34ndNVgeYwbL2hW1GgOv5qvt_7Eg1PJOqFHdtHIGmIQ4HlbM'],
    'mist': [5,37, 'http://lh5.ggpht.com/CazEBo3iixH30MZQCgw-9-pt-kuCvheOHFp34ndNVgeYwbL2hW1GgOv5qvt_7Eg1PJOqFHdtHIGmIQ4HlbM'],
    'dust': [11,11, 'http://lh5.ggpht.com/CazEBo3iixH30MZQCgw-9-pt-kuCvheOHFp34ndNVgeYwbL2hW1GgOv5qvt_7Eg1PJOqFHdtHIGmIQ4HlbM'],
    'smoke': [11,11, 'http://lh5.ggpht.com/CazEBo3iixH30MZQCgw-9-pt-kuCvheOHFp34ndNVgeYwbL2hW1GgOv5qvt_7Eg1PJOqFHdtHIGmIQ4HlbM'],
    'haze': [11,11, 'http://lh5.ggpht.com/CazEBo3iixH30MZQCgw-9-pt-kuCvheOHFp34ndNVgeYwbL2hW1GgOv5qvt_7Eg1PJOqFHdtHIGmIQ4HlbM'],
    'hazy': [11,11, 'http://lh5.ggpht.com/CazEBo3iixH30MZQCgw-9-pt-kuCvheOHFp34ndNVgeYwbL2hW1GgOv5qvt_7Eg1PJOqFHdtHIGmIQ4HlbM'],
    'chance_of_rain': [14,40, 'http://lh3.ggpht.com/_u3jcgz-Tk1wWRROL8VWLR6sOfnrtEGn0FI_ntyMA2_Z13kZvgQhvFqh8q1LZlpFp27Zx1apOjBgGpv1Bg'],
    'chancerain': [14,40, 'http://lh3.ggpht.com/_u3jcgz-Tk1wWRROL8VWLR6sOfnrtEGn0FI_ntyMA2_Z13kZvgQhvFqh8q1LZlpFp27Zx1apOjBgGpv1Bg'],
    'chance_of_storm': [16,42, 'http://lh3.ggpht.com/_u3jcgz-Tk1wWRROL8VWLR6sOfnrtEGn0FI_ntyMA2_Z13kZvgQhvFqh8q1LZlpFp27Zx1apOjBgGpv1Bg'],
    'chance_of_snow': [21,43, 'http://lh6.ggpht.com/0AY-PZ1AfXkrieUqx7hQA7SxAMT26TCHkAYJBjCgNuV3623gmGLo0T8ADoW8kAZeUtVQpGK_wtA32jReWw'],
    'chancesnow': [21,43, 'http://lh6.ggpht.com/0AY-PZ1AfXkrieUqx7hQA7SxAMT26TCHkAYJBjCgNuV3623gmGLo0T8ADoW8kAZeUtVQpGK_wtA32jReWw'],
    'chance_of_tstorm': [17,41, 'http://lh4.ggpht.com/deZqTwrOaDGk8DxTBcEY_hZOm9Ze4qG-jEF2_N7HalsfWUiNFGk_52cge8_L3LxMQ0W47o17ofFyNeYpkA'],
    'chancetstorms': [17,41, 'http://lh4.ggpht.com/deZqTwrOaDGk8DxTBcEY_hZOm9Ze4qG-jEF2_N7HalsfWUiNFGk_52cge8_L3LxMQ0W47o17ofFyNeYpkA'],
    'chanceflurries': [26,26, 'http://lh6.ggpht.com/0AY-PZ1AfXkrieUqx7hQA7SxAMT26TCHkAYJBjCgNuV3623gmGLo0T8ADoW8kAZeUtVQpGK_wtA32jReWw'],
    'chancesleet': [19,19, 'http://lh6.ggpht.com/0AY-PZ1AfXkrieUqx7hQA7SxAMT26TCHkAYJBjCgNuV3623gmGLo0T8ADoW8kAZeUtVQpGK_wtA32jReWw']
  };

  var cargado = {
    reporte: false,
    radar: false
  };

  function genModuloActual(dest, ide, cont) {
    var i = document.createElement('div');
    i.className = 'titulo modulo';
    i.id = ide;
    i.dataset.titulo = getI18nMsg('clima_'+ide);
    i.textContent = cont;
    dest.appendChild(i);
  }

  function convertir(req) {
    if(req.status == 200) {
      var datos = JSON.parse(req.responseText);
      console.log(datos);
      return [datos.current_observation, datos.forecast.simpleforecast, datos.hourly_forecast];
    } else {
      throw 'Error'
    }
  }
  
  function procesar(actual, semanal, porhora) {
    var txt,
      tend = (actual.pressure_trend == '0' ? '●': (actual.pressure_trend == '+' ? '▲':'▼')),
      sist = (localStorage.getItem('livet_climasist') == 'true');

    txt = document.getElementById('proveedor');
    txt.href = actual.forecast_url;
    txt.textContent = getI18nMsg('clima_proveedor');
    
    document.getElementById('ubicacion').firstElementChild.textContent = actual.display_location.full;
    localStorage.setItem('livet_clima_ubicnum', actual.forecast_url.split('/').pop().split('.')[0]);
    
    var condactual = new DOMgen('div', 'actuales', 'bloque').appTo(pivot).item;
    condactual.style.backgroundImage = 'url('+ condicion[actual.icon][2] +'=s'+ Math.floor(pivot.offsetHeight * 1.8 + 50) +')';
    
    var detall = new DOMgen('div', 'detalles').html('<div id="actualtemp">'+ Math.round(actual['temp_'+ (sist ? 'c' : 'f')]) +'&deg;</div>').appTo(condactual).item;
    
    genModuloActual(detall, 'actualcondic', actual.weather);
    genModuloActual(detall, 'actualpresio', actual['pressure_'+ (sist ? 'mb' : 'in')]+' '+ (sist ? 'mb' : 'in') +' '+ tend);
    genModuloActual(detall, 'actualhumeda', actual.relative_humidity);
    genModuloActual(detall, 'actualradiac', actual.UV);
    genModuloActual(detall, 'actualprecip', actual['precip_today_'+(sist ? 'metric' : 'in')] + (sist ? ' mm' : ' in'));
    genModuloActual(detall, 'actualviento', actual.wind_dir+' '+actual['wind_'+(sist ? 'kph' : 'mph')] + (sist ? ' kph' : ' mph'));
    
    new DOMgen('small').clase('clear').txt(actual.observation_time).appTo(detall);

    var pronos = new DOMgen('div', 'prediccion').appTo(condactual).item;
    semanal.forecastday.forEach(function(itm, i) {
      var mod = document.createElement('div');
      mod.className = 'modulo';
      var txt = '<p class="dia">'+ itm.date.weekday_short +' '+ itm.date.day +'</p>';
      txt += '<div style="background-image: url(/appclima/'+ condicion[itm.icon][0] +'.png);" class="condicon"></div>';
      txt += '<p class="temps">'+ itm.low[sist ? 'celsius' : 'fahrenheit'] +'&deg; / '+ itm.high[sist ? 'celsius' : 'fahrenheit'] +'&deg;</p><p class="estado">'+ itm.conditions;
      if(itm.pop)
        txt += '<span class="pop">'+ itm.pop +'%</span>';
      mod.innerHTML = txt +'</p>';
      pronos.appendChild(mod);
    });
    
    var blporhora = new DOMgen('div', 'porhora', 'bloque scrollable').appTo(pivot).item;
    var porhrcont = new DOMgen('div').clase('porhrcont').appTo(blporhora).on(mousewheel, function(evt) {
      evt.stopPropagation();
    }).item;
    for(var i = 0; i < 24; i++) {
      var hora = document.createElement('div');
      var intr = '<span>'+ porhora[i].FCTTIME.civil +'</span><span style="background-image: url(/appclima/';
      intr += condicion.get(porhora[i]) +'.png)">'+ porhora[i].feelslike[sist ? 'metric' : 'english'] +'&deg;</span>';
      intr += '<span>'+ porhora[i].condition +'</span><span>'+ porhora[i].pop +'%</span>';
      hora.innerHTML = intr;
      porhrcont.appendChild(hora);
    }
    return actual.display_location;
  }
  
  function getRadar(loc) {
    var defer = Q.defer(),
      radar = new Image();
    radar.className = 'bloque';
    radar.id = 'radar';
    radar.onload = function() {
      pivot.appendChild(this);
      defer.resolve(radar);
    };
    radar.onerror = function() {
      defer.reject(radar);
    };
    
    var url = 'http://wublast.wunderground.com/cgi-bin/WUBLAST?lat='+ loc.latitude + '&lon='+ loc.longitude;
    url += '&zoom=3&width=500&height='+ (pivot.offsetHeight - 140);
    url += '&key=sat_ir4_thumb&basemap=1&gtt=0&num=1&timelabel=0&delay=25&borders=1&theme=WUBLAST_WORLD';
    url += '&extension=png&proj=ll&rand='+ Math.floor(new Date().getTime() / 1000);
    radar.src = url;
    
    return defer.promise;
  }

}, false);