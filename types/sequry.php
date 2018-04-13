<?php

use QUI\FrontendUsers\Controls\Auth\FrontendLogin;


// todo wenn Projektlogo und Placeholder nicht eingestellt sind, soll SEQURY Logo verwendet werden.
$Logo = $Project->getMedia()->getLogoImage();

$FrontendLogin = new FrontendLogin([
    'showRegistration' => false
]);


$Engine->assign([
    'Logo' => $Logo,
    'FrontendLogin' => $FrontendLogin
]);
