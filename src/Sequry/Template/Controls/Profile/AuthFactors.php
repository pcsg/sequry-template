<?php
/**
 * This file contains Sequry\Template\Controls\Profile\AuthFactors
 */

namespace Sequry\Template\Controls\Profile;

use QUI;
use QUI\FrontendUsers\Controls\Profile;
use QUI\Control;
use QUI\FrontendUsers\Controls\Profile\ControlInterface;

class AuthFactors extends Control implements ControlInterface
{

    public function __construct(array $attributes = [])
    {
        parent::__construct($attributes);

        $this->setAttributes([
            'data-qui' => 'package/sequry/template/bin/js/controls/components/profile/AuthFactors'
        ]);

        $this->addCSSClass('quiqqer-sequry-profile-auth-factors');
        $this->addCSSFile(dirname(__FILE__) . '/AuthFactors.css');
    }

    /**
     * @return string
     */
    public function getBody()
    {
        $Engine = QUI::getTemplateManager()->getEngine();

        $User = QUI::getUserBySession();
        $settings = $User->getAttribute('pcsg.gpm.settings.authplugins');

        $Engine->assign([
            'value' => $settings
        ]);

        return $Engine->fetch(dirname(__FILE__) . '/AuthFactors.html');
    }

    /**
     * event: on save
     */
    public function onSave()
    {
//        $Request = QUI::getRequest();
//
//        if (!$Request->request->get('profile-save')) {
//            return;
//        }
//
//        /* @var $User QUI\Interfaces\Users\User */
//        $data = $Request->request->all();
//        $User = $this->getAttribute('User');
//
//        $User->setAttributes($data);
//        $User->save();
    }


    public function validate()
    {

    }
}
