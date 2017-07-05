function clearInput(){
    $("#weather-app [name='addCity-input']").val("");
}



var App = React.createClass({
    getInitialState: function(){
        return {
            arr_citiesList: []
        };
    },



    togglePreloader(active){
        if(active == "on"){
            $("#weather-app .preloader").addClass("active");
        } else {
            $("#weather-app .preloader").removeClass("active");
        }
    },

    getJson(api, ifSession){
        $.getJSON(api, data => {
            var cityName = data.city.name;
            var tempKelvin = Math.round(data.list[0].temp.day);
            var tempC = Math.round(tempKelvin - 273);
            var windSpeed = data.list[0].speed;
            var wetherType = data.list[0].weather[0].description;
            var humidity = data.list[0].humidity;

            var sessionStorageArr;

            this.state.arr_citiesList.push({
                cityName: cityName,
                tempKelvin: tempKelvin,
                tempC: tempC,
                windSpeed: windSpeed,
                wetherType: wetherType,
                humidity: humidity,
                statistic: [
                    Math.round(data.list[0].temp.day - 273),
                    Math.round(data.list[1].temp.day - 273),
                    Math.round(data.list[2].temp.day - 273),
                    Math.round(data.list[3].temp.day - 273),
                    Math.round(data.list[4].temp.day - 273),
                    Math.round(data.list[5].temp.day - 273)
                ]
            });
            this.setState({ arr_citiesList: this.state.arr_citiesList });

            if(sessionStorage.arr_citiesList){
                sessionStorageArr = sessionStorage.arr_citiesList.split("|");
                if(ifSession === undefined) sessionStorageArr.push(cityName);
            } else {
                sessionStorage.setItem("arr_citiesList", cityName);
                sessionStorageArr = sessionStorage.arr_citiesList.split("|");
            }

            sessionStorage.arr_citiesList = sessionStorageArr.join("|");
            this.togglePreloader("off");
        }).fail(e => {
            this.togglePreloader("off");
        });
    },

    toggleCity(e){
        $(e).addClass("active");
    },

    deleteCity(e){
        var deletingCityName = e.target.innerHTML;

        var sessionStorageArr = [];

        for(var i = 0; i < this.state.arr_citiesList.length; i++){
            if(this.state.arr_citiesList[i].cityName == deletingCityName){
                this.state.arr_citiesList.splice(i, 1);
                this.setState({ arr_citiesList: this.state.arr_citiesList });

                if(this.state.arr_citiesList[i]) sessionStorageArr.push(this.state.arr_citiesList[i].cityName);
            } else {
                sessionStorageArr.push(this.state.arr_citiesList[i].cityName);
            }
        }
        sessionStorage.arr_citiesList = sessionStorageArr.join("|");
    },

    addCity: function(){
        var inputVal = $("input[name='addCity-input']").val();
        var api = "http://api.openweathermap.org/data/2.5/forecast/daily?q=" + inputVal + "&appid=235e859c409d9c20c356a24f8a39624e";

        this.togglePreloader("on");
        this.getJson(api);

        clearInput();
    },



    render: function(){
        return (
            <div className="container">
                <div className="addCity-container">
                    <input type="text" name="addCity-input"></input>
                    <div onClick={this.addCity} className="addCity-button">Add</div>
                </div>

                <div className="citiesList-container">
                    <div className="citiesCount-container">
                        <span className="citiesCount-title">Cities count:</span>
                        <span className="citiesCount-num">{ this.state.arr_citiesList.length }</span>
                    </div>

                    { this.state.arr_citiesList.map( city => {
                        return (
                            <div onClick={ this.toggleCity } className="city">
                                <div className="city__title-container">
                                    <div className="city__title">{city.cityName}.</div>
                                    <div className="city__weather">{city.wetherType}</div>
                                    <div onClick={this.deleteCity} className="city__delete-button">{city.cityName}</div>
                                </div>

                                <div className="weather-container">
                                    <div className="weather-info">
                                        <img src="/img/weather-temp.svg" className="weather-icon" />
                                        <div className="weather-value">{city.tempC}</div>
                                    </div>

                                    <div className="weather-info">
                                        <img src="/img/weather-wind.svg" className="weather-icon" />
                                        <div className="weather-value">{city.windSpeed} м/с</div>
                                    </div>

                                    <div className="weather-info">
                                        <img src="/img/weather-humidity.svg" className="weather-icon" />
                                        <div className="weather-value">{city.humidity}%</div>
                                    </div>
                                </div>

                                <div className="calendar">
                                    <div className="calendar__day">
                                        <div className="calendar__day-name">Today</div>
                                        <div className="calendar__day-temp">{city.statistic[0]} C</div>
                                    </div>
                                    <div className="calendar__day">
                                        <div className="calendar__day-name">Yesterday</div>
                                        <div className="calendar__day-temp">{city.statistic[1]} C</div>
                                    </div>
                                    <div className="calendar__day">
                                        <div className="calendar__day-name">2 days ago</div>
                                        <div className="calendar__day-temp">{city.statistic[2]} C</div>
                                    </div>
                                    <div className="calendar__day">
                                        <div className="calendar__day-name">3 days ago</div>
                                        <div className="calendar__day-temp">{city.statistic[3]} C</div>
                                    </div>
                                    <div className="calendar__day">
                                        <div className="calendar__day-name">4 days ago</div>
                                        <div className="calendar__day-temp">{city.statistic[4]} C</div>
                                    </div>
                                    <div className="calendar__day">
                                        <div className="calendar__day-name">5 days ago</div>
                                        <div className="calendar__day-temp">{city.statistic[5]} C</div>
                                    </div>
                                    <div className="calendar__day bold">
                                        <div className="calendar__day-name">On average</div>
                                        <div className="calendar__day-temp">{
                                            Math.round((city.statistic[0] + city.statistic[1] + city.statistic[2] + city.statistic[3] + city.statistic[4] + city.statistic[5]) / 6)
                                        } C</div>
                                    </div>
                                </div>
                            </div>
                        );
                    }) }

                    <div className="preloader"></div>
                </div>
            </div>
        );
    },

    componentDidMount: function(){
        if(navigator.geolocation){

            // * Раскомментировать при загрузке на сервер
            // * Код снизу удалить
            //
            // this.togglePreloader("on");
            // 
            // function getGeo(){
            //     navigator.geolocation.getCurrentPosition(function(position){
            //         var long = position.coords.longitude;
            //         var lat = position.coords.latitude;
            //     
            //         var api = "http://api.openweathermap.org/data/2.5/forecast/daily?lat=" + lat + "&lon=" + long + "&appid=235e859c409d9c20c356a24f8a39624e";
            //         his.getJson(api);
            //     }); // .getCurrentPosition
            // }
            //
            // if(sessionStorage.arr_citiesList){
            //     var sessionStorageArr = sessionStorage.arr_citiesList.split("|");
            //
            //     if(sessionStorageArr.length > 0){
            //         sessionStorageArr.forEach(e => {
            //             var apiLocal = "http://api.openweathermap.org/data/2.5/forecast/daily?q=" + e + "&appid=235e859c409d9c20c356a24f8a39624e";
            //             this.getJson(apiLocal, true);
            //         });
            //     } else {
            //         getGeo();
            //     }
            // } else {
            //     getGeo();
            // }



            if(sessionStorage.arr_citiesList){
                var sessionStorageArr = sessionStorage.arr_citiesList.split("|");

                if(sessionStorageArr.length > 0){
                    sessionStorageArr.forEach(e => {
                        var apiLocal = "http://api.openweathermap.org/data/2.5/forecast/daily?q=" + e + "&appid=235e859c409d9c20c356a24f8a39624e";
                        this.getJson(apiLocal, true);
                    });
                } else {
                    sessionStorage.arr_citiesList = "";

                    var api = "http://api.openweathermap.org/data/2.5/forecast/daily?q=Moskow&appid=235e859c409d9c20c356a24f8a39624e";
                    setTimeout(e => {
                        this.getJson(api);
                    }, 3000);
                }
            } else {
                var api = "http://api.openweathermap.org/data/2.5/forecast/daily?q=Moskow&appid=235e859c409d9c20c356a24f8a39624e";
                setTimeout(e => {
                    this.getJson(api);
                }, 3000);
            }

            this.togglePreloader("on");
        }
    }
}); // Class. App
    

    
ReactDOM.render(<App />, document.getElementById("weather-app"));