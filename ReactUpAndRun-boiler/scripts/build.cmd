@echo off
cmd /c babel --presets react,es2015 js\source -d js\build
cmd /c browserify js\build\app.js -o bundle.js
type css\components\* css\* > bundle.css
powershell -command "(Get-Content bundle.css).replace('../../images', 'images') | Set-Content bundle.css"
echo %date% %time%
@echo on
