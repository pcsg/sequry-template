<?php

/**
 * Dummy function: it returns an array with the password data
 *
 * @return array
 */

QUI::$Ajax->registerFunction(
    'package_sequry_template_ajax_getList',
    function () {

        $passData = [
            0 => [
                'id'                 => 1,
                'title'              => 'Facebook',
                'description'        => 'Vivamus suscipit tortor eget felis porttitor volutpat',
                'securityClassId'    => 1,
                'dataType'           => 'Zugangsdaten',
                'ownerId'            => 96245121,
                'ownerType'          => 1,
                'favorite]'          => 0,
                'isOwner]'           => 1,
                'access]'            => 'user',
                'canShare'           => 1,
                'canDelete'          => 1,
                'canLink'            => '',
                'ownerName'          => 'admin',
                'sharedWithUsers'    => '',
                'sharedWithGroups'   => '',
                'securityClassTitle' => '1-Faktor (Login-Passwort)'
            ],
            1 => [
                'id'                 => 1,
                'title'              => 'Twitter',
                'description'        => 'Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia.',
                'securityClassId'    => 1,
                'dataType'           => 'Zugangsdaten',
                'ownerId'            => 96245121,
                'ownerType'          => 1,
                'favorite]'          => 0,
                'isOwner]'           => 1,
                'access]'            => 'user',
                'canShare'           => 1,
                'canDelete'          => 1,
                'canLink'            => '',
                'ownerName'          => 'admin',
                'sharedWithUsers'    => '',
                'sharedWithGroups'   => '',
                'securityClassTitle' => '1-Faktor (Login-Passwort)'
            ],
            2 => [
                'id'                 => 1,
                'title'              => 'Google',
                'description'        => 'Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia.',
                'securityClassId'    => 1,
                'dataType'           => 'Zugangsdaten',
                'ownerId'            => 96245121,
                'ownerType'          => 1,
                'favorite]'          => 0,
                'isOwner]'           => 1,
                'access]'            => 'user',
                'canShare'           => 1,
                'canDelete'          => 1,
                'canLink'            => '',
                'ownerName'          => 'admin',
                'sharedWithUsers'    => '',
                'sharedWithGroups'   => '',
                'securityClassTitle' => '1-Faktor (Login-Passwort)'
            ]
        ];

        return $passData;

    },

    [],
    false
);
