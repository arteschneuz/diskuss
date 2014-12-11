#https://addons.mozilla.org/en-US/firefox/addon/autoinstaller/

C:\Users\holger.moosbauer\Desktop\addon-sdk-1.17\addon-sdk-1.17\bin
activate
C:\Users\holger.moosbauer\Desktop\diskuss\extension\firefox
cfx xpi --pkgdir=C:\Users\holger.moosbauer\Desktop\diskuss\extension\firefox\src
wget --post-file=C:\Users\holger.moosbauer\Desktop\diskuss\extension\firefox\diskuss.xpi http://localhost:8888/