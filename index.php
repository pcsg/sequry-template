<?php

use QUI\FrontendUsers\Controls\Auth\FrontendLogin;
use Sequry\Core\Constants\Sequry as SequryConstants;

$logoUrl = URL_OPT_DIR . 'sequry/template/bin/images/Sequry_logo_250x40.png';

if ($Project->getMedia()->getLogoImage()) {
    $logoUrl = $Project->getMedia()->getLogoImage()->getSizeCacheUrl();
}

$FrontendLogin = new FrontendLogin([
    'showRegistration' => false
]);

$SessionUser = QUI::getUserBySession();
$isAuth      = boolval($SessionUser->getId());


$Avatar = new QUI\FrontendUsers\Controls\UserIcon([
    'User' => QUI::getUserBySession()
]);

$Engine->assign([
    'logoUrl'               => $logoUrl,
    'FrontendLogin'      => $FrontendLogin,
    'isAuth'             => $isAuth,
    'SessionUser'        => $SessionUser,
    'isPasswordLinkSite' => $Site->getAttribute('type') === SequryConstants::SITE_TYPE_PASSWORDLINK,
    'Avatar'             => $Avatar
]);
