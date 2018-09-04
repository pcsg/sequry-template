<?php
/**
 * This file contains Sequry\Template\Controls\Profile\AuthFactors
 */

namespace Sequry\Template\Controls\Profile;

use QUI;
use QUI\Control;
use QUI\FrontendUsers\Controls\Profile\ControlInterface;

class AuthFactors extends Control implements ControlInterface
{

    /**
     * Data to save as JSON string
     *
     * @var string
     */
    protected $data;

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
     * @throws QUI\Exception
     */
    public function getBody()
    {
        $Engine = QUI::getTemplateManager()->getEngine();

        $User     = QUI::getUserBySession();
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
        $Request    = QUI::getRequest()->request;
        $User       = QUI::getUserBySession();
        $this->data = $Request->get('pcsg.gpm.settings.authplugins');

        if (QUI::getUsers()->isNobodyUser($User)) {
            return;
        }

        $User->setAttribute(
            'pcsg.gpm.settings.authplugins',
            $Request->get('pcsg.gpm.settings.authplugins')
        );

        $this->validate();

        $User->save();
    }


    /**
     * Validate data and convert to bool / int.
     *
     * @return void
     */
    public function validate()
    {
        $data = json_decode($this->data);

        foreach ($data as $entry) {
            if ($entry->autosave) {
                $entry->autosave = boolval($entry->autosave);
            }

            if ($entry->priority) {
                $entry->priority = intval($entry->priority);
            }
        }

        $this->data = json_encode($data);
    }
}
