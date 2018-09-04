<?php
/**
 * This file contains Sequry\Template\Controls\Profile\AuthMethods
 */

namespace Sequry\Template\Controls\Profile;

use QUI;
use QUI\Control;
use QUI\FrontendUsers\Controls\Profile\ControlInterface;

class AuthMethods extends Control implements ControlInterface
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
            'data-qui' => 'package/sequry/template/bin/js/controls/components/profile/AuthMethods'
        ]);

        $this->addCSSClass('quiqqer-sequry-profile-auth-methods');
        $this->addCSSFile(dirname(__FILE__) . '/AuthMethods.css');
    }

    /**
     * @return string
     * @throws QUI\Exception
     */
    public function getBody()
    {
        $Engine = QUI::getTemplateManager()->getEngine();

        return $Engine->fetch(dirname(__FILE__) . '/AuthMethods.html');
    }

    /**
     * event: on save
     */
    public function onSave()
    {

    }

    /**
     * Validate data and convert to bool / int.
     *
     * @return void
     */
    public function validate()
    {

    }
}
