<?php

/**
 * Dummy function: it returns an array with the password data from user
 *
 * @return array
 */

QUI::$Ajax->registerFunction(
    'package_sequry_template_ajax_passwords_getList',
    function () {

//        sleep(2);

        $passData = [
            [
                'id'                 => 1,
                'title'              => 'Facebook',
                'description'        => 'Vivamus suscipit tortor eget felis porttitor volutpat',
                'securityClassId'    => 1,
                'dataType'           => 'Zugangsdaten',
                'ownerId'            => 1337,
                'ownerType'          => 1,
                'favorite'           => 0,
                'isOwner'            => 1,
                'access'             => 'user',
                'canShare'           => 1,
                'canDelete'          => 1,
                'canLink'            => '',
                'ownerName'          => 'admin',
                'sharedWithUsers'    => '',
                'sharedWithGroups'   => '',
                'securityClassTitle' => '1-Faktor (Login-Passwort)'
            ],
            [
                'id'                 => 2,
                'title'              => 'Twitter',
                'description'        => 'Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia.',
                'securityClassId'    => 0,
                'dataType'           => 'Zugangsdaten',
                'ownerId'            => 1337,
                'ownerType'          => 1,
                'favorite'           => 0,
                'isOwner'            => 1,
                'access'             => 'user',
                'canShare'           => 1,
                'canDelete'          => 1,
                'canLink'            => '',
                'ownerName'          => 'admin',
                'sharedWithUsers'    => '',
                'sharedWithGroups'   => '',
                'securityClassTitle' => '1-Faktor (Login-Passwort)'
            ],
            [
                'id'                 => 3,
                'title'              => 'Google',
                'description'        => 'Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia.',
                'securityClassId'    => 1,
                'dataType'           => 'Zugangsdaten',
                'ownerId'            => 1337,
                'ownerType'          => 1,
                'favorite'           => 1,
                'isOwner'            => 1,
                'access'             => 'user',
                'canShare'           => 1,
                'canDelete'          => 1,
                'canLink'            => '',
                'ownerName'          => 'admin',
                'sharedWithUsers'    => '',
                'sharedWithGroups'   => '',
                'securityClassTitle' => '1-Faktor (Login-Passwort)'
            ],
            [
                'id'                 => 4,
                'title'              => 'PCSG Server',
                'description'        => 'Donec velit neque, auctor sit amet aliquam vel, ullamcorper sit amet ligula.',
                'securityClassId'    => 1,
                'dataType'           => 'FTP-Server',
                'ownerId'            => 1337,
                'ownerType'          => 1,
                'favorite'           => 0,
                'isOwner'            => 1,
                'access'             => 'user',
                'canShare'           => 1,
                'canDelete'          => 1,
                'canLink'            => '',
                'ownerName'          => 'admin',
                'sharedWithUsers'    => '',
                'sharedWithGroups'   => '',
                'securityClassTitle' => '1-Faktor (Login-Passwort)'
            ],
            [
                'id'                 => 5,
                'title'              => 'PCSG Server mit langem Titel',
                'description'        => 'Praesent sapien massa, convallis a pellentesque nec, egestas non nisi.',
                'securityClassId'    => 1,
                'dataType'           => 'FTP-Server',
                'ownerId'            => 1337,
                'ownerType'          => 1,
                'favorite'           => 0,
                'isOwner'            => 1,
                'access'             => 'user',
                'canShare'           => 1,
                'canDelete'          => 1,
                'canLink'            => '',
                'ownerName'          => 'admin',
                'sharedWithUsers'    => '',
                'sharedWithGroups'   => '',
                'securityClassTitle' => '1-Faktor (Login-Passwort)'
            ],
            [
                'id'                 => 6,
                'title'              => 'Mein private key',
                'description'        => 'Proin eget tortor risus. Quisque velit nisi, pretium ut lacinia in, elementum id enim',
                'securityClassId'    => 1,
                'dataType'           => 'SSH-Keys',
                'ownerId'            => 1337,
                'ownerType'          => 1,
                'favorite'           => 1,
                'isOwner'            => 1,
                'access'             => 'user',
                'canShare'           => 1,
                'canDelete'          => 1,
                'canLink'            => '',
                'ownerName'          => 'admin',
                'sharedWithUsers'    => '',
                'sharedWithGroups'   => '',
                'securityClassTitle' => '1-Faktor (Login-Passwort)'
            ],
            [
                'id'                 => 7,
                'title'              => 'Pinterest',
                'description'        => 'Quisque velit nisi, pretium ut lacinia in, elementum id enim.',
                'securityClassId'    => 1,
                'dataType'           => 'Zugangsdaten',
                'ownerId'            => 1337,
                'ownerType'          => 1,
                'favorite'           => 0,
                'isOwner'            => 1,
                'access'             => 'user',
                'canShare'           => 1,
                'canDelete'          => 1,
                'canLink'            => '',
                'ownerName'          => 'admin',
                'sharedWithUsers'    => '',
                'sharedWithGroups'   => '',
                'securityClassTitle' => '1-Faktor (Login-Passwort)'
            ],
            [
                'id'                 => 8,
                'title'              => 'Gmail',
                'description'        => 'Curabitur arcu erat, accumsan id imperdiet et, porttitor at sem',
                'securityClassId'    => 1,
                'dataType'           => 'Zugangsdaten',
                'ownerId'            => 1337,
                'ownerType'          => 1,
                'favorite'           => 0,
                'isOwner'            => 1,
                'access'             => 'user',
                'canShare'           => 1,
                'canDelete'          => 1,
                'canLink'            => '',
                'ownerName'          => 'admin',
                'sharedWithUsers'    => '',
                'sharedWithGroups'   => '',
                'securityClassTitle' => '1-Faktor (Login-Passwort)'
            ],
            [
                'id'                 => 9,
                'title'              => 'Peat\'s private key',
                'description'        => 'Cras ultricies ligula sed magna dictum porta.',
                'securityClassId'    => 1,
                'dataType'           => 'SSH-Keys',
                'ownerId'            => 1337,
                'ownerType'          => 1,
                'favorite'           => 1,
                'isOwner'            => 1,
                'access'             => 'user',
                'canShare'           => 1,
                'canDelete'          => 1,
                'canLink'            => '',
                'ownerName'          => 'admin',
                'sharedWithUsers'    => '',
                'sharedWithGroups'   => '',
                'securityClassTitle' => '1-Faktor (Login-Passwort)'
            ],
            [
                'id'                 => 10,
                'title'              => 'Sparkasse - Online Konto',
                'description'        => 'Vivamus magna justo, lacinia eget consectetur sed, convallis at tellus.',
                'securityClassId'    => 1,
                'dataType'           => 'Zugangsdaten',
                'ownerId'            => 1337,
                'ownerType'          => 1,
                'favorite'           => 0,
                'isOwner'            => 1,
                'access'             => 'user',
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
