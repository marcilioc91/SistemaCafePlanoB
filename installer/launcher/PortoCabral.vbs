Dim fso, shell, scriptDir, ps1Path, cmd
Set fso   = CreateObject("Scripting.FileSystemObject")
Set shell = CreateObject("WScript.Shell")

scriptDir = fso.GetParentFolderName(WScript.ScriptFullName)
ps1Path   = scriptDir & "\PortoCabral.ps1"

cmd = "powershell.exe -NonInteractive -ExecutionPolicy Bypass -WindowStyle Hidden -File """ & ps1Path & """"

' 0 = janela oculta, False = nao aguardar terminar (abre e sai do VBS)
shell.Run cmd, 0, False

Set shell = Nothing
Set fso   = Nothing
