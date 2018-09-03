<?php

use Sequry\Core\PasswordTypes\Handler;

/**
 * Get view template of password
 *
 * @return array
 */

QUI::$Ajax->registerFunction(
    'package_sequry_template_ajax_passwords_getViewTemplate',
    function ($type) {

        // this template name
        $layout = 'Core';

        try {
            return Handler::getViewTemplateFrontend($type, $layout);
        } catch (\QUI\Exception $Exception) {

            $L  = QUI::getLocale();
            $lg = 'sequry/template';

            \QUI\System\Log::writeException($Exception);

            return getErrorMessageTemplate(
                $L->get($lg, 'sequry.panel.template.passwordTypeNotSupported')
            );
        }
    },
    ['type'],
    false
);

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