$(function() {
    //オプションを使わずデフォルトで良い場合は $( '#bb-bookblock' ).bookblock(); だけで大丈夫
    $( '#bb-bookblock' ).bookblock( {
      orientation : 'vertical', //横にめくるか縦にめくるかを設定
      speed : 800, //めくるスピードの設定
      shadowFlip : 0.7, //めくる際につける影の設定
      direction : 'ltr' //右開きか左開きかを設定
    } );
               
    //ナビゲーションを設定
    $( '#bb-nav-next' ).on( 'click', function() {
      $( '#bb-bookblock' ).bookblock( 'next' );
      return false;
    })
    $( '#bb-nav-prev' ).on( 'click', function() {
    $( '#bb-bookblock' ).bookblock( 'prev' );
    return false;
    });
    
    $( '#bb-nav-first' ).on( 'click', function() {
    $( '#bb-bookblock' ).bookblock( 'first' );
    return false;
    });
    
    $( '#bb-nav-last' ).on( 'click', function() {
    $( '#bb-bookblock' ).bookblock( 'last' );
    return false;
    });
    
    
})