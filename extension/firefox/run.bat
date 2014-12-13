#https://addons.mozilla.org/en-US/firefox/addon/autoinstaller/

C:\Users\xxx\Desktop\addon-sdk-1.17\addon-sdk-1.17\bin
activate
C:\Users\xxx\Desktop\diskuss\extension\firefox
cfx xpi --pkgdir=C:\Users\xxx\Desktop\diskuss\extension\firefox\src
wget --post-file=C:\Users\xxx\Desktop\diskuss\extension\firefox\diskuss.xpi http://localhost:8888/
