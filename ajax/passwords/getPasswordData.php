<?php

/**
 * Dummy function: it returns an array with the password data from user
 *
 * @return array
 */

QUI::$Ajax->registerFunction(
    'package_sequry_template_ajax_passwords_getPasswordData',
    function ($passId) {

        $allPasswords = dummyData();

        foreach ($allPasswords as $elm) {
            if ($elm['id'] == $passId) {
                return $elm;
            }
        }

        return false;
    },
    ['passId'],
    false
);

function dummyData()
{
    return [
        [
            'id'                 => 1,
            'title'              => 'Facebook',
            'description'        => 'Vivamus suscipit tortor eget felis porttitor volutpat',
            'payload'            => [
                'user'     => 'super_admin',
                'password' => '123456',
                'url'      => 'www.facebook.com',
                'note'     => 'Curabitur arcu erat, accumsan id imperdiet et, porttitor at sem. Pellentesque in ipsum id orci porta dapibus. Sed porttitor lectus nibh. Cras ultricies ligula sed magna dictum porta.'
            ],
            'securityClassId'    => 1,
            'dataType'           => 'Website',
            'categoryIds'        => false,
            'createUserId'       => '1337',
            'createDate'         => '1523972106',
            'editUserId'         => '96245121',
            'editDate'           => '1523972106',
            'categoryIdsPrivate' => [
                ""
            ],
            'favorite'           => '0'
        ],
        [
            'id'                 => 2,
            'title'              => 'Twitter',
            'description'        => 'Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia.',
            'payload'            => [
                'user'     => 'twitter_user',
                'password' => '123"!§$%%%$aU$§',
                'url'      => 'www.twitter.com',
                'note'     => ' Curabitur arcu erat, accumsan id imperdiet et, porttitor at sem. Quisque velit nisi, pretium ut lacinia in, elementum id enim. Mauris blandit aliquet elit, eget tincidunt nibh pulvinar a.'
            ],
            'securityClassId'    => 1,
            'dataType'           => 'Website',
            'categoryIds'        => false,
            'createUserId'       => '1337',
            'createDate'         => '1523972106',
            'editUserId'         => '96245121',
            'editDate'           => '1523972106',
            'categoryIdsPrivate' => [
                ""
            ],
            'favorite'           => '0'
        ],
        [
            'id'                 => 3,
            'title'              => 'Google',
            'description'        => 'Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia.',
            'payload'            => [
                'user'     => 'meduza143',
                'password' => 'myPasswordIsStrong',
                'url'      => 'www.google.com',
                'note'     => ''
            ],
            'securityClassId'    => 1,
            'dataType'           => 'Website',
            'categoryIds'        => false,
            'createUserId'       => '1337',
            'createDate'         => '1523972106',
            'editUserId'         => '96245121',
            'editDate'           => '1523972106',
            'categoryIdsPrivate' => [
                ""
            ],
            'favorite'           => '1'
        ],
        [
            'id'                 => 4,
            'title'              => 'PCSG Server',
            'description'        => 'Donec velit neque, auctor sit amet aliquam vel, ullamcorper sit amet ligula.',
            'payload'            => [
                'host'     => 'www.server-pcsg.de',
                'user'     => 'meduza143',
                'password' => '111\"3123',
                'note'     => 'Cras ultricies ligula sed magna dictum porta. Donec rutrum congue leo eget malesuada. Proin eget tortor risus. Mauris blandit aliquet elit, eget tincidunt nibh pulvinar a.'
            ],
            'securityClassId'    => 1,
            'dataType'           => 'Ftp',
            'categoryIds'        => false,
            'createUserId'       => '1337',
            'createDate'         => '1524818078',
            'editUserId'         => '96245121',
            'editDate'           => '1524818078',
            'categoryIdsPrivate' => [
                ""
            ],
            'favorite'           => '0'
        ],
        [
            'id'                 => 5,
            'title'              => 'PCSG Server mit langem Titel',
            'description'        => 'Praesent sapien massa, convallis a pellentesque nec, egestas non nisi.',
            'payload'            => [
                'host'     => 'www.server-pcsg.de',
                'user'     => 'meduza143',
                'password' => '111\"3123',
                'note'     => 'Uonec rutrum congue leo eget malesuada. Proin eget tortor risus. Mauris blandit aliquet elit, eget tincidunt nibh pulvinar a.'
            ],
            'securityClassId'    => 1,
            'dataType'           => 'Ftp',
            'categoryIds'        => false,
            'createUserId'       => '1337',
            'createDate'         => '1523972106',
            'editUserId'         => '96245121',
            'editDate'           => '1524818078',
            'categoryIdsPrivate' => [
                ""
            ],
            'favorite'           => '1'
        ],
        [
            'id'                 => 6,
            'title'              => 'Mein private key',
            'description'        => 'Proin eget tortor risus. Quisque velit nisi, pretium ut lacinia in, elementum id enim',
            'payload'            => [
                'host'     => 'www.dev.quiqqer.de',
                'user'     => 'monko-ponko',
                'password' => 's7$las!pe',
                'key'      => 'ssh-rsa AAAAB3NzaC1yc2EAAAABIwAAAQEAklOUpkDHrfHY17SbrmTIpNLTGK9Tjom\/BWDSU\nGPl+nafzlHDTYW7hdI4yZ5ew18JH4JW9jbhUFrviQzM7xlELEVf4h9lFX5QVkbPppSwg0cda3\nPbv7kOdJ\/MTyBlWXFCR+HAo3FXRitBqxiX1nKhXpHAZsMciLq8V6RjsNAQwdsdMFvSlVK\/7XA\nt3FaoJoAsncM1Q9x5+3V0Ww68\/eIFmb1zuUFljQJKprrX88XypNDvjYNby6vw\/Pb0rwert\/En\nmZ+AW4OZPnTPI89ZPmVMLuayrD2cE86Z\/il8b+gw3r3+1nKatmIkjn2so1d01QraTlMqVSsbx\nNrRFi9wrf+M7Q3NzaC1yc2EAAAABIwAAAQEAklOUpkDHrfHY17SbrmTIpNLTGK9Tjom\/BWDSU\nGPl+nafzlHDTYW7hdI4yZ5ew18JH4JW9jbhUFrviQzM7xlELEVf4h9lFX5QVkbPppSwg0cda3\nPbv7kOdJ\/MTyBlWXFCR+HAo3FXRitBqxiX1nKhXpHAZsMciLq8V6RjsNAQwdsdMFvSlVK\/7XA\nt3FaoJoAsncM1Q9x5+3V0Ww68\/eIFmb1zuUFljQJKprrX88XypNDvjYNby6vw\/Pb0rwert\/En\nmZ+AW4OZPnTPI89ZPmVMLuayrD2cE86Z\/il8b+gw3r3+1nKatmIkjn2so1d01QraTlMqVSsbx\nNrRFi9wrf+M7Q== mega@super.local",',
                'note'     => 'Mege eget tortor risus. Mauris blandit aliquet elit, eget tincidunt nibh pulvinar.'
            ],
            'securityClassId'    => 1,
            'dataType'           => 'SecretKey',
            'categoryIds'        => false,
            'createUserId'       => '1337',
            'createDate'         => '1523972106',
            'editUserId'         => '96245121',
            'editDate'           => '1524818078',
            'categoryIdsPrivate' => [
                ""
            ],
            'favorite'           => '1'
        ],
        [
            'id'                 => 7,
            'title'              => 'Pinterest',
            'description'        => '',
            'payload'            => [
                'user'     => 'konkarkana',
                'password' => 'passKon_ka_ra_na',
                'url'      => 'www.pinterest.com',
                'note'     => ''
            ],
            'securityClassId'    => 1,
            'dataType'           => 'Website',
            'categoryIds'        => false,
            'createUserId'       => '1337',
            'createDate'         => '1523972106',
            'editUserId'         => '96245121',
            'editDate'           => '1524818078',
            'categoryIdsPrivate' => [
                ""
            ],
            'favorite'           => '0'
        ],
        [
            'id'                 => 8,
            'title'              => 'Gmail',
            'description'        => 'Curabitur arcu erat, accumsan id imperdiet et, porttitor at sem',
            'payload'            => [
                'user'     => 'montag_user',
                'password' => 'kredowa-muszla',
                'url'      => 'www.gmail.com',
                'note'     => ''
            ],
            'securityClassId'    => 1,
            'dataType'           => 'Website',
            'categoryIds'        => false,
            'createUserId'       => '1337',
            'createDate'         => '1523972106',
            'editUserId'         => '96245121',
            'editDate'           => '1524818078',
            'categoryIdsPrivate' => [
                ""
            ],
            'favorite'           => '0'
        ],
        [
            'id'                 => 9,
            'title'              => 'Peat\'s private key',
            'description'        => 'Cras ultricies ligula sed magna dictum porta.',
            'payload'            => [
                'host'     => 'www.dev.quiqqer.de',
                'user'     => 'monko-ponko',
                'password' => 's7$las!pe',
                'key'      => 'ssh-rsa AAAAB3NzaC1yc2ffffEAAAABIwAasdfAAQEAklOUpssssskDHrfHY17SbraaaaamTIpNLTGK9Tjom\/BWDSU\nGPl+nafzlHDTYW7hdI4yZ5ew18JH4JW9jbhUFrv5iQzM7xlELEVf4h9lFX5QVkbPppSwg0cda3\nPbvEgZ7kOdJ\/MTyBlWXFCR+HAo3FXRitBqxiX1nKhXpHAZsMciLq8V6RjsNAQwdsdMFvSlVK\/7XA\nt3FaoJoAsncM1Q9x5+3V0Ww68\/eIFmb1zuUFljQJKprrX88XypNDvjYNby6vw\/Pb0rwert\/En\nmZ+AW4OZPnTPI89ZPmVMLuayrD2cE86Z\/il8b+gw3r3+1nKatmIkjn2so1d01QraTlMqVSsbx\nNrRFi9wrf+M7Q3NzaC1yc2EAAAABIwAAAQEAklOUpkDHrfHY17SbrmTIpNLTGK9Tjom\/BWDSU\nGPl+nafzlHDTYW7hdI4yZ5ew18JH4JW9jbhUFrviQzM7xlELEVf4h9lFX5QVkbPppSwg0cda3\nPbv7kOdJ\/MTyBlWXFCR+HAo3FXRitBqxiX1nKhXpHAZsMciLq8V6RjsNAQwdsdMFvSlVK\/7XA\nt3FaoJoAsncM1Q9x5+3V0Ww68\/eIFmb1zuUFljQJKprrX88XypNDvjYNby6vw\/Pb0rwert\/En\nmZ+AW4OZPnTPI89ZPmVMLuayrD2cE86Z\/il8b+gw3r3+1nKatmIkjn2so1d01QraTlMqVSsbx\nNrRFi9wrf+M7Q== mega@super.local",',
                'note'     => 'Curabitur non nulla sit amet nisl tempus convallis quis ac lectus. Pellentesque in ipsum id orci porta dapibus.'
            ],
            'securityClassId'    => 1,
            'dataType'           => 'SecretKey',
            'categoryIds'        => false,
            'createUserId'       => '666',
            'createDate'         => '1523972178',
            'editUserId'         => '96245121',
            'editDate'           => '1524818078',
            'categoryIdsPrivate' => [
                ""
            ],
            'favorite'           => '1'
        ],
        [
            'id'                 => 10,
            'title'              => 'Sparkasse - Online Konto',
            'description'        => 'Vivamus magna justo, lacinia eget consectetur sed, convallis at tellus.',
            'payload'            => [
                'user'     => 'a123456',
                'password' => 'a1111',
                'url'      => 'www.sparkasse-wuppertal.de',
                'note'     => ''
            ],
            'securityClassId'    => 1,
            'dataType'           => 'Website',
            'categoryIds'        => false,
            'createUserId'       => '1337',
            'createDate'         => '1523972106',
            'editUserId'         => '96245121',
            'editDate'           => '1524818078',
            'categoryIdsPrivate' => [
                ""
            ],
            'favorite'           => '0'
        ]

    ];
}
