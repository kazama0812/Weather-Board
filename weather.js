let obniz = new Obniz("0900-9155");  //自分のobnizの番号に書き換えて下さい
/*  ②ここに必要な変数宣言を書きます  */
let led1, led2, led3, distSensor,fLED;


obniz.onconnect = async function () {
  /*  ③ここに様々なJavaScriptの処理を書きます  */
  led1 = obniz.wired("LED", {anode: 0, cathode: 1});
  //led2 = obniz.wired("LED", {anode: 2, cathode: 3});
  //led3 = obniz.wired("LED", {anode: 4, cathode: 5});
  distSensor = obniz.wired("GP2Y0A21YK0F",{vcc:6, gnd:7, signal:8});
  //距離センサー　赤が６。黒が７、黄色が８
  fLED = obniz.wired("WS2811", {gnd:2, vcc:3, din:4});
  

  //対象物までの距離が変化した時
  distSensor.start( function( distance ){
    $("#distance").text( Math.ceil(distance/10) + "cm");  //距離をページ内に表示
    if(distance < 300){             //距離が300mm(=30cm)未満なら

      //天気予報WebAPIにアクセスしてJSONデータ取得
      $.get("https://portal.iwasaki.ac.jp/ws/getWeather.php?q=Yokohama",
      async function(data){

        //今日の天気予報
        let weather = data[0].day.condition.text;
        $("#weather").text(weather);

        //アイコン設定
        let weatherIcon = data[0].day.condition.icon;
        $("#weatherIcon").attr('src',weatherIcon);

        //降水確率
        let chanceOfRain = data[0].day.daily_chance_of_rain;
        $("#chanceOfRain").text(chanceOfRain);

        //最高気温
        let maxtemp = data[0].day.maxtemp_c;
        $("#maxtemp").text(maxtemp);

        //最低気温
        let mintemp = data[0].day.mintemp_c;
        $("#mintemp").text(mintemp);

        //平均気温
        let avgtemp = data[0].day.avgtemp_c;
        $("#avgtemp").text(avgtemp);

        //最大風速
        let maxwind = data[0].day.maxwind_kph;
        $("#maxwind").text(maxwind);

        //平均湿度
        let avghumidity = data[0].day.avghumidity;
        $("#avghumidity").text(avghumidity);





        
        //obnizのディスプレイに天気表示
        obniz.display.clear();
        obniz.display.pos(0, 0);
        obniz.display.print("横浜市の天気");

        obniz.display.pos(0, 20);
        obniz.display.print(weather);

        obniz.display.pos(0,40);
        obniz.display.print("降水確率" + chanceOfRain + "%");

      //  let tomorrowWeather = data[1].day.condition.text;
      //  $("tomorrowWeather").text(tomorrowWeather);

        //天気予報に「雨」という文字列が含まれていれば
          if(weather.indexOf("雨" || "雪") != -1){
          //fLED.rgb(0, 0, 0);
            led3.on();
            console.log("led3");
            await obniz.wait(60000);     //60秒待つ
            led3.off();   
        }
        //天気予報に「曇り」という文字列が含まれていれば
        else if(weather.indexOf("曇り") != -1){
          fLED.rgbs([
            [255, 255, 255]
            // 追加の配列要素をここに追加することも可能
          ]);
          //led2.on();
          console.log("led2");
          await obniz.wait(60000);     //60秒待つ 
          //led2.off();
        } 

        //天気予報に「晴れ」という文字列が含まれていれば
        else if(weather.indexOf("晴れ") != -1){
        // fLED.rgb(0, 0, 0); 
          led1.on(); 
          console.log("led1");
          await obniz.wait(60000);     //60秒待つ 
          led1.off();
        } 

        } 
      );
    } 
  }
)
};