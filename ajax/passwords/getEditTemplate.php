<?php

use Sequry\Core\PasswordTypes\Handler;

/**
 *
 * @return array
 */

QUI::$Ajax->registerFunction(
    'package_sequry_template_ajax_passwords_getEditTemplate',
    function ($type) {

        // this template name
        $layout = 'core';

        $L  = QUI::getLocale();
        $lg = 'sequry/template';


        try {
            $templatePath = Handler::getEditTemplateFrontend($type, $layout);
        } catch (\QUI\Exception $Exception) {
            \QUI\System\Log::writeException($Exception);

            return getErrorMessageTemplate(
                $L->get($lg, 'sequry.panel.template.passwordTypeNotSupported')
            );
        }


        $Engine = QUI::getTemplateManager()->getEngine();

        $Engine->assign(getTranslations($type));

        return $Engine->fetch($templatePath);
    },
    ['type'],
    false
);

function getTranslations($type)
{
    $L            = QUI::getLocale();
    $lg           = 'sequry/template';
    $translations = [];

    switch ($type) {
        case 'Website':
            $translations = [
                'userLabel'           => $L->get($lg, 'sequry.panel.template.user'),
                'userPlaceholder'     => $L->get($lg, 'sequry.panel.template.userPlaceholder'),
                'passwordLabel'       => $L->get($lg, 'sequry.panel.template.password'),
                'passwordPlaceholder' => $L->get($lg, 'sequry.panel.template.passwordPlaceholder'),
                'urlLabel'            => $L->get($lg, 'sequry.panel.template.url'),
                'urlPlaceholder'      => $L->get($lg, 'sequry.panel.template.urlPlaceholder'),
                'noteLabel'           => $L->get($lg, 'sequry.panel.template.note'),
                'notePlaceholder'     => $L->get($lg, 'sequry.panel.template.notePlaceholder')
            ];
            break;
    }

    return $translations;
}

function getErrorMessageTemplate($message)
{
    $html = '<label class="password-field-row">';
    $html .= '<span class="password-field-row-left"></span>';
    $html .= '<div class="password-field-row-right">';
    $html .= '<div class="pcsg-gpm-password-warning">';
    $html .= $message;
    $html .= '</div>';
    $html .= '</div>';
    $html .= '</label>';

    return $html;
}
