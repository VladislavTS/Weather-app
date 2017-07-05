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
            var cityName = data.name;
            var tempKelvin = Math.round(data.main.temp);
            var tempC = Math.round(tempKelvin - 273);
            var windSpeed = data.wind.speed;
            var wetherType = data.weather[0].description;
            var humidity = data.main.humidity;

            var sessionStorageArr;

            this.state.arr_citiesList.push({
                cityName: cityName,
                tempKelvin: tempKelvin,
                tempC: tempC,
                windSpeed: windSpeed,
                wetherType: wetherType,
                humidity: humidity
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
            console.log(sessionStorage.arr_citiesList);

            this.togglePreloader("off");
        }).fail(e => {
            this.togglePreloader("off");
        });
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
        var api = "http://api.openweathermap.org/data/2.5/weather?q=" + inputVal + "&appid=235e859c409d9c20c356a24f8a39624e";

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
                            <div className="city">
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
            //         var api = "http://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + long + "&appid=235e859c409d9c20c356a24f8a39624e";
            //         his.getJson(api);
            //     }); // .getCurrentPosition
            // }
            //
            // if(sessionStorage.arr_citiesList){
            //     var sessionStorageArr = sessionStorage.arr_citiesList.split("|");
            //
            //     if(sessionStorageArr.length > 0){
            //         sessionStorageArr.forEach(e => {
            //             var apiLocal = "http://api.openweathermap.org/data/2.5/weather?q=" + e + "&appid=235e859c409d9c20c356a24f8a39624e";
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
                        var apiLocal = "http://api.openweathermap.org/data/2.5/weather?q=" + e + "&appid=235e859c409d9c20c356a24f8a39624e";
                        this.getJson(apiLocal, true);
                    });
                } else {
                    sessionStorage.arr_citiesList = "";

                    var api = "http://api.openweathermap.org/data/2.5/weather?q=Moskow&appid=235e859c409d9c20c356a24f8a39624e";
                    setTimeout(e => {
                        this.getJson(api);
                    }, 3000);
                }
            } else {
                var api = "http://api.openweathermap.org/data/2.5/weather?q=Moskow&appid=235e859c409d9c20c356a24f8a39624e";
                setTimeout(e => {
                    this.getJson(api);
                }, 3000);
            }

            this.togglePreloader("on");
        }
    }
}); // Class. App
    

    
ReactDOM.render(<App />, document.getElementById("weather-app"));