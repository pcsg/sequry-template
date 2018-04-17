<?php

use QUI\FrontendUsers\Controls\Auth\FrontendLogin;

$Logo = $Project->getMedia()->getLogoImage();

$FrontendLogin = new FrontendLogin([
    'showRegistration' => false
]);

$SessionUser = QUI::getUserBySession();
$isAuth      = boolval($SessionUser->getId());


$Engine->assign([
    'Logo' => $Logo,
    'FrontendLogin' => $FrontendLogin,
    'isAuth'        => $isAuth,
    'SessionUser'   => $SessionUser
]);
