<?php

use QUI\FrontendUsers\Controls\Auth\FrontendLogin;
use Sequry\Core\Constants\Sequry as SequryConstants;

$Logo = $Project->getMedia()->getLogoImage();


$FrontendLogin = new FrontendLogin([
    'showRegistration' => false
]);

$SessionUser = QUI::getUserBySession();
$isAuth      = boolval($SessionUser->getId());


$Avatar = new QUI\FrontendUsers\Controls\UserIcon([
    'User' => QUI::getUserBySession()
]);

$Engine->assign([
    'Logo'               => $Logo,
    'FrontendLogin'      => $FrontendLogin,
    'isAuth'             => $isAuth,
    'SessionUser'        => $SessionUser,
    'isPasswordLinkSite' => $Site->getAttribute('type') === SequryConstants::SITE_TYPE_PASSWORDLINK,
    'Avatar'             => $Avatar
]);
