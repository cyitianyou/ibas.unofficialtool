@echo off
setlocal EnableDelayedExpansion
echo ***************************************************************************
echo                build_all.bat
echo                     by niuren.zhu
echo                           2017.01.13
echo  说明：
echo     1. 此脚本需要在Node.js command prompt下运行。
echo     2. 遍历当前目录下所有子目录，存在tsconfig.json则编译。
echo     3. 参数1，tsc命令的其他参数，如：-w，表示监听文件变化。
echo ****************************************************************************
REM 设置参数变量
REM 工作目录
SET WORK_FOLDER=%~dp0
REM 若工作目录最后字符不是“\”则补齐
if "%WORK_FOLDER:~-1%" neq "\" SET WORK_FOLDER=%WORK_FOLDER%\
echo --工作的目录：%WORK_FOLDER%
REM 其他参数
SET OPTIONS=%~1
REM 构建命令
SET COMMOND=tsc
if "%OPTIONS%" neq "" (
  SET COMMOND=start /min !COMMOND! %OPTIONS%
  echo 命令：!COMMOND!
)
REM 映射库
SET IBAS_FOLDER=%IBAS_TS_LIB%
if "%IBAS_FOLDER%" equ "" (
REM 没有定义环境变量
  if exist "%WORK_FOLDER%..\..\..\..\..\ibas-typescript\" (
    SET IBAS_FOLDER=%WORK_FOLDER%..\..\..\..\..\ibas-typescript\
  )
)

REM 检查并映射库
if "%IBAS_FOLDER%" neq "" (
echo --检查库符号链接
  if not exist %WORK_FOLDER%3rdparty\ibas mklink /d .\3rdparty\ibas %IBAS_FOLDER%ibas\ > nul
  if not exist %WORK_FOLDER%3rdparty\openui5 mklink /d .\3rdparty\openui5 %IBAS_FOLDER%openui5\ > nul
  if not exist %WORK_FOLDER%3rdparty\shell mklink /d .\3rdparty\shell %IBAS_FOLDER%shell\ > nul
)

REM 编译项目配置
SET TS_CONFIGS=tsconfig.json
SET TS_CONFIGS=%TS_CONFIGS% bsui\c\tsconfig.json
SET TS_CONFIGS=%TS_CONFIGS% bsui\m\tsconfig.json

FOR %%l IN (%TS_CONFIGS%) DO (
  SET TS_CONFIG=%%l
  echo --开始编译：!TS_CONFIG!
  call !COMMOND! -p !TS_CONFIG!
)
if exist "%WORK_FOLDER%..\..\..\..\docs\unofficialtool" rd /s /q "%WORK_FOLDER%..\..\..\..\docs\unofficialtool"
mkdir "%WORK_FOLDER%..\..\..\..\docs\unofficialtool"
mkdir "%WORK_FOLDER%..\..\..\..\docs\unofficialtool\resources"
copy /y "%WORK_FOLDER%index.js" "%WORK_FOLDER%..\..\..\..\docs\unofficialtool"
copy /y "%WORK_FOLDER%index.ui.c.js" "%WORK_FOLDER%..\..\..\..\docs\unofficialtool"
xcopy "%WORK_FOLDER%\3rdparty\reportbro\*.*" "%WORK_FOLDER%..\..\..\..\docs\unofficialtool\3rdparty\reportbro\" /s/y
xcopy "%WORK_FOLDER%\resources\*.*" "%WORK_FOLDER%..\..\..\..\docs\unofficialtool\resources\" /s/y