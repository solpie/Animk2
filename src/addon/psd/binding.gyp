{
  "targets": [
    {
      "target_name": "psd",
      "sources": [ "psd.cc" ],
            'include_dirs': [ './inc'],
        "libraries": ['../lib/libpng.lib','../lib/zlib']
    },
    {
      'target_name': 'action_after_build',
       'dependencies': [ 'psd' ],
      'type': 'none',
      'copies': [
          {
            'files': [ '<(PRODUCT_DIR)/psd.node' ],
            'destination': '../../../node_modules/addon/'
          }
    ]
    }
  ]
}