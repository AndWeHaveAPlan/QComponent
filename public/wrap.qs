def ItemTemplate WrapTemplate
    padding: 13px 0
    transition: 'all 0.2s ease'

    div
        padding: 26px 26px 0
        Image icon
            background: white
            source: {{img}}
            border-radius: 25%
            padding: 0 0 100% 0
            stretch: uniformToFill
            //.click: ()=>alert(1)
    center: {{name}}
        color: white
        margin: 6.5px 0 0
    .mouseenter: ()=>
            self.set('scale', 1.5);
    .mouseleave: ()=>
            self.set('scale', 1);
    //.click: ()=>{alert(1)}


def Page main
    height: 100%

    HBox
        height: 100%
        flexDefinition: * 500

        WrapPanel wp1
            selectionColor: transparent;
            background: #339
            margin: 0 auto
            width: 500px
            //height: 800px
            height: 100%
            padding: 26px

            itemWidth: 25%
            itemTemplate: WrapTemplate
            itemSource: [
                {name:'Phone' ,img:'https://udemy-images.s3.amazonaws.com/redactor/legacy/images/article/2013-08-26_09-38-25__Phone_iOS7_App_Icon_Rounded.png'},
                {name:'Yandex taxi' ,img:'http://a5.mzstatic.com/us/r30/Purple30/v4/f5/b1/a4/f5b1a4a7-7c43-e368-ad30-6331060ea5fa/icon175x175.png'},
                {name:'Qiwi wallet' ,img:'https://static.qiwi.com/img/qiwi_com/favicon/favicon-192x192.png'},
                {name:'Yandex maps' ,img:'http://i.utdstc.com/icons/256/yandex-maps-android.png'},
                {name:'Telegram' ,img:'http://www.freeiconspng.com/uploads/telegram-icon-14.png'},
                {name:'Phone' ,img:'https://udemy-images.s3.amazonaws.com/redactor/legacy/images/article/2013-08-26_09-38-25__Phone_iOS7_App_Icon_Rounded.png'},
                {name:'Yandex taxi' ,img:'http://a5.mzstatic.com/us/r30/Purple30/v4/f5/b1/a4/f5b1a4a7-7c43-e368-ad30-6331060ea5fa/icon175x175.png'},
                {name:'Qiwi wallet' ,img:'https://static.qiwi.com/img/qiwi_com/favicon/favicon-192x192.png'},
                {name:'Yandex maps' ,img:'http://i.utdstc.com/icons/256/yandex-maps-android.png'},
                {name:'Telegram' ,img:'http://www.freeiconspng.com/uploads/telegram-icon-14.png'},
                {name:'Phone' ,img:'https://udemy-images.s3.amazonaws.com/redactor/legacy/images/article/2013-08-26_09-38-25__Phone_iOS7_App_Icon_Rounded.png'},
                {name:'Yandex taxi' ,img:'http://a5.mzstatic.com/us/r30/Purple30/v4/f5/b1/a4/f5b1a4a7-7c43-e368-ad30-6331060ea5fa/icon175x175.png'},
                {name:'Qiwi wallet' ,img:'https://static.qiwi.com/img/qiwi_com/favicon/favicon-192x192.png'},
                {name:'Yandex maps' ,img:'http://i.utdstc.com/icons/256/yandex-maps-android.png'},
                {name:'Telegram' ,img:'http://www.freeiconspng.com/uploads/telegram-icon-14.png'},
                {name:'Phone' ,img:'https://udemy-images.s3.amazonaws.com/redactor/legacy/images/article/2013-08-26_09-38-25__Phone_iOS7_App_Icon_Rounded.png'},
                {name:'Yandex taxi' ,img:'http://a5.mzstatic.com/us/r30/Purple30/v4/f5/b1/a4/f5b1a4a7-7c43-e368-ad30-6331060ea5fa/icon175x175.png'},
                {name:'Qiwi wallet' ,img:'https://static.qiwi.com/img/qiwi_com/favicon/favicon-192x192.png'},
                {name:'Yandex maps' ,img:'http://i.utdstc.com/icons/256/yandex-maps-android.png'},
                {name:'Telegram' ,img:'http://www.freeiconspng.com/uploads/telegram-icon-14.png'},
                {name:'Phone' ,img:'https://udemy-images.s3.amazonaws.com/redactor/legacy/images/article/2013-08-26_09-38-25__Phone_iOS7_App_Icon_Rounded.png'},
                {name:'Yandex taxi' ,img:'http://a5.mzstatic.com/us/r30/Purple30/v4/f5/b1/a4/f5b1a4a7-7c43-e368-ad30-6331060ea5fa/icon175x175.png'},
                {name:'Qiwi wallet' ,img:'https://static.qiwi.com/img/qiwi_com/favicon/favicon-192x192.png'},
                {name:'Yandex maps' ,img:'http://i.utdstc.com/icons/256/yandex-maps-android.png'},
                {name:'Telegram' ,img:'http://www.freeiconspng.com/uploads/telegram-icon-14.png'},
                {name:'Phone' ,img:'https://udemy-images.s3.amazonaws.com/redactor/legacy/images/article/2013-08-26_09-38-25__Phone_iOS7_App_Icon_Rounded.png'},
                {name:'Yandex taxi' ,img:'http://a5.mzstatic.com/us/r30/Purple30/v4/f5/b1/a4/f5b1a4a7-7c43-e368-ad30-6331060ea5fa/icon175x175.png'},
                {name:'Qiwi wallet' ,img:'https://static.qiwi.com/img/qiwi_com/favicon/favicon-192x192.png'},
                {name:'Yandex maps' ,img:'http://i.utdstc.com/icons/256/yandex-maps-android.png'},
                {name:'Telegram' ,img:'http://www.freeiconspng.com/uploads/telegram-icon-14.png'},
                {name:'Phone' ,img:'https://udemy-images.s3.amazonaws.com/redactor/legacy/images/article/2013-08-26_09-38-25__Phone_iOS7_App_Icon_Rounded.png'},
                {name:'Yandex taxi' ,img:'http://a5.mzstatic.com/us/r30/Purple30/v4/f5/b1/a4/f5b1a4a7-7c43-e368-ad30-6331060ea5fa/icon175x175.png'},
                {name:'Qiwi wallet' ,img:'https://static.qiwi.com/img/qiwi_com/favicon/favicon-192x192.png'},
                {name:'Yandex maps' ,img:'http://i.utdstc.com/icons/256/yandex-maps-android.png'},
                {name:'Telegram' ,img:'http://www.freeiconspng.com/uploads/telegram-icon-14.png'},
                {name:'Phone' ,img:'https://udemy-images.s3.amazonaws.com/redactor/legacy/images/article/2013-08-26_09-38-25__Phone_iOS7_App_Icon_Rounded.png'},
                {name:'Yandex taxi' ,img:'http://a5.mzstatic.com/us/r30/Purple30/v4/f5/b1/a4/f5b1a4a7-7c43-e368-ad30-6331060ea5fa/icon175x175.png'},
                {name:'Qiwi wallet' ,img:'https://static.qiwi.com/img/qiwi_com/favicon/favicon-192x192.png'},
                {name:'Yandex maps' ,img:'http://i.utdstc.com/icons/256/yandex-maps-android.png'},
                {name:'Telegram' ,img:'http://www.freeiconspng.com/uploads/telegram-icon-14.png'},
                {name:'Phone' ,img:'https://udemy-images.s3.amazonaws.com/redactor/legacy/images/article/2013-08-26_09-38-25__Phone_iOS7_App_Icon_Rounded.png'},
                {name:'Yandex taxi' ,img:'http://a5.mzstatic.com/us/r30/Purple30/v4/f5/b1/a4/f5b1a4a7-7c43-e368-ad30-6331060ea5fa/icon175x175.png'},
                {name:'Qiwi wallet' ,img:'https://static.qiwi.com/img/qiwi_com/favicon/favicon-192x192.png'},
                {name:'Yandex maps' ,img:'http://i.utdstc.com/icons/256/yandex-maps-android.png'},
                {name:'Telegram' ,img:'http://www.freeiconspng.com/uploads/telegram-icon-14.png'},
                {name:'Phone' ,img:'https://udemy-images.s3.amazonaws.com/redactor/legacy/images/article/2013-08-26_09-38-25__Phone_iOS7_App_Icon_Rounded.png'},
                {name:'Yandex taxi' ,img:'http://a5.mzstatic.com/us/r30/Purple30/v4/f5/b1/a4/f5b1a4a7-7c43-e368-ad30-6331060ea5fa/icon175x175.png'},
                {name:'Qiwi wallet' ,img:'https://static.qiwi.com/img/qiwi_com/favicon/favicon-192x192.png'},
                {name:'Yandex maps' ,img:'http://i.utdstc.com/icons/256/yandex-maps-android.png'},
                {name:'Telegram' ,img:'http://www.freeiconspng.com/uploads/telegram-icon-14.png'},
                {name:'Phone' ,img:'https://udemy-images.s3.amazonaws.com/redactor/legacy/images/article/2013-08-26_09-38-25__Phone_iOS7_App_Icon_Rounded.png'},
                {name:'Yandex taxi' ,img:'http://a5.mzstatic.com/us/r30/Purple30/v4/f5/b1/a4/f5b1a4a7-7c43-e368-ad30-6331060ea5fa/icon175x175.png'},
                {name:'Qiwi wallet' ,img:'https://static.qiwi.com/img/qiwi_com/favicon/favicon-192x192.png'},
                {name:'Yandex maps' ,img:'http://i.utdstc.com/icons/256/yandex-maps-android.png'},
                {name:'Telegram' ,img:'http://www.freeiconspng.com/uploads/telegram-icon-14.png'},
                {name:'Phone' ,img:'https://udemy-images.s3.amazonaws.com/redactor/legacy/images/article/2013-08-26_09-38-25__Phone_iOS7_App_Icon_Rounded.png'},
                {name:'Yandex taxi' ,img:'http://a5.mzstatic.com/us/r30/Purple30/v4/f5/b1/a4/f5b1a4a7-7c43-e368-ad30-6331060ea5fa/icon175x175.png'},
                {name:'Qiwi wallet' ,img:'https://static.qiwi.com/img/qiwi_com/favicon/favicon-192x192.png'},
                {name:'Yandex maps' ,img:'http://i.utdstc.com/icons/256/yandex-maps-android.png'},
                {name:'Telegram' ,img:'http://www.freeiconspng.com/uploads/telegram-icon-14.png'},
                {name:'Phone' ,img:'https://udemy-images.s3.amazonaws.com/redactor/legacy/images/article/2013-08-26_09-38-25__Phone_iOS7_App_Icon_Rounded.png'},
                {name:'Yandex taxi' ,img:'http://a5.mzstatic.com/us/r30/Purple30/v4/f5/b1/a4/f5b1a4a7-7c43-e368-ad30-6331060ea5fa/icon175x175.png'},
                {name:'Qiwi wallet' ,img:'https://static.qiwi.com/img/qiwi_com/favicon/favicon-192x192.png'},
                {name:'Yandex maps' ,img:'http://i.utdstc.com/icons/256/yandex-maps-android.png'},
                {name:'Telegram' ,img:'http://www.freeiconspng.com/uploads/telegram-icon-14.png'},
                {name:'Phone' ,img:'https://udemy-images.s3.amazonaws.com/redactor/legacy/images/article/2013-08-26_09-38-25__Phone_iOS7_App_Icon_Rounded.png'},
                {name:'Yandex taxi' ,img:'http://a5.mzstatic.com/us/r30/Purple30/v4/f5/b1/a4/f5b1a4a7-7c43-e368-ad30-6331060ea5fa/icon175x175.png'},
                {name:'Qiwi wallet' ,img:'https://static.qiwi.com/img/qiwi_com/favicon/favicon-192x192.png'},
                {name:'Yandex maps' ,img:'http://i.utdstc.com/icons/256/yandex-maps-android.png'},
                {name:'Telegram' ,img:'http://www.freeiconspng.com/uploads/telegram-icon-14.png'},
                {name:'Phone' ,img:'https://udemy-images.s3.amazonaws.com/redactor/legacy/images/article/2013-08-26_09-38-25__Phone_iOS7_App_Icon_Rounded.png'},
                {name:'Yandex taxi' ,img:'http://a5.mzstatic.com/us/r30/Purple30/v4/f5/b1/a4/f5b1a4a7-7c43-e368-ad30-6331060ea5fa/icon175x175.png'},
                {name:'Qiwi wallet' ,img:'https://static.qiwi.com/img/qiwi_com/favicon/favicon-192x192.png'},
                {name:'Yandex maps' ,img:'http://i.utdstc.com/icons/256/yandex-maps-android.png'},
                {name:'Telegram' ,img:'http://www.freeiconspng.com/uploads/telegram-icon-14.png'},
                {name:'Phone' ,img:'https://udemy-images.s3.amazonaws.com/redactor/legacy/images/article/2013-08-26_09-38-25__Phone_iOS7_App_Icon_Rounded.png'},
                {name:'Yandex taxi' ,img:'http://a5.mzstatic.com/us/r30/Purple30/v4/f5/b1/a4/f5b1a4a7-7c43-e368-ad30-6331060ea5fa/icon175x175.png'},
                {name:'Qiwi wallet' ,img:'https://static.qiwi.com/img/qiwi_com/favicon/favicon-192x192.png'},
                {name:'Yandex maps' ,img:'http://i.utdstc.com/icons/256/yandex-maps-android.png'},
                {name:'Telegram' ,img:'http://www.freeiconspng.com/uploads/telegram-icon-14.png'}
                ]

        div
            h1: {{wp1.selectedItem.name}}
            Image:
                width: 100%
                padding: 0 0 100%
                source: {{wp1.selectedItem.img}}
                stretch: uniform