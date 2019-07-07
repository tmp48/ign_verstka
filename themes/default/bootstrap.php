<?php
/**
 * Theme bootstrap file.
 */
Yii::app()->getComponent('bootstrap');

Yii::app()->getClientScript()->registerScript('baseUrl', "var baseUrl = '" . Yii::app()->getBaseUrl(true) . "';", CClientScript::POS_HEAD);

// Favicon
Yii::app()->getClientScript()->registerLinkTag('shortcut icon', null, Yii::app()->getTheme()->getAssetsUrl() . '/images/favicon.ico');
Yii::app()->getClientScript()->registerLinkTag('stylesheet', null, 'https://fonts.googleapis.com/css?family=Roboto+Condensed:400,700&amp;subset=cyrillic');

Yii::app()->getClientScript()->registerScript('map-scheme', "var scheme_address = '" . Yii::app()->getModule('yupe')->site_address . "';var scheme_address2 = '" . Yii::app()->getModule('yupe')->site_address2 . "';", CClientScript::POS_HEAD);
Yii::import('themes.'.Yii::app()->theme->name.'.DefautThemeEvents');  
