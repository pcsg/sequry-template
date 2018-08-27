<?php
/**
 * This file contains QUI\Sequry\CoreTemplate\Controls\Profile\AuthFactors
 */
namespace QUI\Sequry\CoreTemplate\Controls\Profile;

use QUI;
use QUI\FrontendUsers\Controls\Profile;
use QUI\Control;
use QUI\FrontendUsers\Controls\Profile\ControlInterface;

class MySettingControl extends Control implements ControlInterface
{

    public function __construct(array $attributes = array())
    {
        $this->setAttributes(array(
            'class'    => 'teeeeeeeeeeeeest33333333333',


            'quiClass' => 'package/sequry/core/bin/controls/user/AuthPluginSettings'
            // quiClass wird nicht mehr benötigt
        ));

        parent::__construct($attributes);

        $this->addCSSClass('teeeeeeeeeeeeest1');
        $this->addCSSClass('teeeeeeeeeeeeeeeest2222');
//        $this->addCSSFile(dirname(__FILE__).'/UserData.css');

    }

    /**
     * @return string
     */
    public function getBody()
    {
        $Engine = QUI::getTemplateManager()->getEngine();

        return $Engine->fetch(dirname(__FILE__).'/AuthFactors.html');
    }

    /**
     * event: on save
     */
    public function onSave()
    {
        $Request = QUI::getRequest();

        if (!$Request->request->get('profile-save')) {
            return;
        }

        /* @var $User QUI\Interfaces\Users\User */
        $data = $Request->request->all();
        $User = $this->getAttribute('User');

        $User->setAttributes($data);
        $User->save();
    }


    public function validate()
    {

    }
}
