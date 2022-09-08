var targetDevice;
let charaA, charaB;
let buttonUuid =  "E95D9882-251D-470A-A062-FA1922DFA9A8";
let AButtonUuid = "E95DDA90-251D-470A-A062-FA1922DFA9A8";
let BButtonUuid = "E95DDA91-251D-470A-A062-FA1922DFA9A8";
function hello(){
    console.log("hello");
}
function pushStart(){
    console.log("pushStart");
    //microbit ボタンサービスのUUIDを直入れ
    

    //デバイスの取得
    /* navigator.bluetooth.requestDevice(
        //デバイスにフィルターかけて、マイクロビットだけが見えるようにできる
        //ようですが上手くいかなかったので、とりあえず全デバイスを許可
        //{filters: [{services:[buttonUuid.toLowerCase()]}] }
        {acceptAllDevices:true,optionalServices:[buttonUuid.toLowerCase()]}
    ) */
    navigator.bluetooth.requestDevice({
        filters: [
        { namePrefix: "BBC micro:bit" }
        ],
        optionalServices: [buttonUuid.toLowerCase()]
    })
    .then(         //デバイス取得できたら
        device => {
            targetDevice = device;
            console.log('Connecting micro:bit');
            return device.gatt.connect();
        }
    ).then(         //接続できたら
        server => {
            console.log('Getting Service');
            return server.getPrimaryService(buttonUuid.toLowerCase());
        }
    ).then(         //サービスが取得できたら
        service => {
            console.log('Getting Characteristics');
            //２つのcharacteristicsの取得を待つ
            return Promise.all([
                //characteristicsの取得（Aボタン用）
                service.getCharacteristic(AButtonUuid.toLowerCase())
                .then(chara => {
                    
                    //停止できるようにグローバルに保持
                    charaA = chara;
                    //通知サービスを開始
                    chara.startNotifications();
                    //リスナー関数の設定
                    chara.addEventListener('characteristicvaluechanged',listenerButtonA);
                }
                ),
                //characteristicsの取得（Bボタン用）
                service.getCharacteristic(BButtonUuid.toLowerCase())
                .then(chara => {
                    //停止できるようにグローバルに保持
                    charaB = chara;
                    //通知サービスを開始
                    chara.startNotifications();
                    //リスナー関数の設定
                    chara.addEventListener('characteristicvaluechanged',listenerButtonB);
                }
                )
                
            ]);
        }
    )
    .catch(
        error => {
            //途中でエラー発生したらエラー出力
            console.log('sorry Error!');
            console.log(error.code);
            console.log(error.message);
            console.log(error.name);
        }
    )
}
//通知停止
function pushStop(){
    if( charaA ){
        //通知の停止
        charaA.stopNotifications().then(() => {
            //リスナーの解放
            charaA.removeEventListener('characteristicvaluechanged',listenerButtonA);
            console.log("stop notification");
        });
    }
    if( charaB ){
        //通知の停止
        charaB.stopNotifications().then(() => {
            //リスナーの解放
            charaB.removeEventListener('characteristicvaluechanged',listenerButtonB);
            console.log("stop notification");
        });
    }
    
}
//再接続用関数
function pushRestart(){
    //通知サービスを開始
    charaA.startNotifications();
    //リスナー関数の設定
    charaA.addEventListener('characteristicvaluechanged',listenerButtonA);
    //通知サービスを開始
    charaB.startNotifications();
    //リスナー関数の設定
    charaB.addEventListener('characteristicvaluechanged',listenerButtonB);
    console.log("pushRestart");
}
    
//Aボタン用リスナ
function listenerButtonA(event){
    /* let chara = event.target; */
    //valueがDataViewオブジェクトになっている。microbit仕様によると値は
    //UINT8で提供されるので、その情報で取得
    /* let message = 'Aボタンが' + getStatus( chara.value.getUint8(0) ); */
   /*  document.getElementById('buttonA').innerHTML = message; */
   /* let statuButton = getStatus(chara.value.getUint8(0));
   alert(statuButton);
   if (statuButton == '長押しされました'){
    $( '#bb-bookblock' ).bookblock( 'first' )
   }else{
    
   } */
   $( '#bb-bookblock' ).bookblock( 'prev' )
}
//Bボタン用リスナ
function listenerButtonB(event){
    /* let chara = event.target;
    let message = 'Bボタンが' + getStatus( chara.value.getUint8(0) );
    document.getElementById('buttonB').innerHTML = message; */
    $( '#bb-bookblock' ).bookblock( 'next' )
}



//ボタンの状態を判別し文字列を返す
function getStatus( value ){
    switch(value){
        case 0:
            return '離されました';
        /* case 1:
            return '押されました'; */
        break;
        case 1:
            return '長押しされました';
        break;
    }
}
function disconnect() {

    if (!targetDevice || !targetDevice.gatt.connected){
    return;
    }
    targetDevice.gatt.disconnect();
    alert("切断しました。");

}