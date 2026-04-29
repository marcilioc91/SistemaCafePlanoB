; =============================================================
;  Inno Setup Script — Porto Cabral
;  Requer: Inno Setup 6+ (https://jrsoftware.org/isdl.php)
; =============================================================

#define AppName    "Porto Cabral"
#define AppVersion "1.0"
#define AppJar     "backend-0.0.1-SNAPSHOT.jar"

[Setup]
AppName={#AppName}
AppVersion={#AppVersion}
AppPublisher=Porto Cabral
DefaultDirName={autopf}\PortoCabral
DefaultGroupName=Porto Cabral
OutputBaseFilename=PortoCabral-Instalador
OutputDir=..\dist
SetupIconFile=logo.ico
Compression=lzma2
SolidCompression=yes
WizardStyle=modern
PrivilegesRequired=admin
MinVersion=10.0
UninstallDisplayName={#AppName}

[Languages]
Name: "brazilianportuguese"; MessagesFile: "compiler:Languages\BrazilianPortuguese.isl"

; =============================================================
;  Arquivos instalados
; =============================================================
[Files]
Source: "..\backend\target\{#AppJar}"; DestDir: "{app}"; DestName: "PortoCabral.jar"; Flags: ignoreversion
Source: "launcher\PortoCabral.ps1";    DestDir: "{app}"; Flags: ignoreversion
Source: "launcher\PortoCabral.vbs";    DestDir: "{app}"; Flags: ignoreversion
; setup-db.ps1 e excluido automaticamente apos a instalacao
Source: "setup-db.ps1"; DestDir: "{app}\setup"; Flags: ignoreversion deleteafterinstall
Source: "logo.ico";    DestDir: "{app}";        Flags: ignoreversion

; =============================================================
;  Atalhos
; =============================================================
[Icons]
Name: "{group}\{#AppName}";         Filename: "{sys}\wscript.exe"; Parameters: """{app}\PortoCabral.vbs"""; WorkingDir: "{app}"; IconFilename: "{app}\logo.ico"
Name: "{commondesktop}\{#AppName}"; Filename: "{sys}\wscript.exe"; Parameters: """{app}\PortoCabral.vbs"""; WorkingDir: "{app}"; IconFilename: "{app}\logo.ico"
Name: "{group}\Desinstalar {#AppName}"; Filename: "{uninstallexe}"

; =============================================================
;  Executa setup do banco apos instalacao
;  (ssPostInstall ja criou application.properties antes deste ponto)
; =============================================================
[Run]
Filename: "powershell.exe"; \
  Parameters: "-NonInteractive -ExecutionPolicy Bypass -File ""{app}\setup\setup-db.ps1"""; \
  StatusMsg: "Configurando banco de dados SQL Server..."; \
  Flags: runascurrentuser waituntilterminated

; =============================================================
;  Codigo Pascal — Pagina customizada de configuracao do banco
; =============================================================
[Code]

var
  DbPage:     TWizardPage;
  edServer:   TEdit;
  edDatabase: TEdit;
  edUser:     TEdit;
  edPassword: TEdit;
  chkWinAuth: TCheckBox;

{ ---- Helpers ---- }

procedure CriarLabel(Pagina: TWizardPage; Texto: String; Topo: Integer);
var lbl: TLabel;
begin
  lbl := TLabel.Create(Pagina);
  lbl.Parent  := Pagina.Surface;
  lbl.Caption := Texto;
  lbl.Top     := Topo;
  lbl.Left    := 0;
  lbl.AutoSize := True;
end;

function CriarEdit(Pagina: TWizardPage; Topo: Integer; Valor: String; Senha: Boolean): TEdit;
var ed: TEdit;
begin
  ed := TEdit.Create(Pagina);
  ed.Parent := Pagina.Surface;
  ed.Top    := Topo;
  ed.Left   := 0;
  ed.Width  := Pagina.SurfaceWidth;
  ed.Text      := Valor;
  ed.CharCase  := ecNormal;
  if Senha then ed.PasswordChar := '*';
  Result := ed;
end;

procedure AtualizarEstado(Sender: TObject);
begin
  edUser.Enabled     := not chkWinAuth.Checked;
  edPassword.Enabled := not chkWinAuth.Checked;
end;

{ ---- Inicializacao do wizard ---- }

procedure InitializeWizard;
var topo: Integer;
begin
  DbPage := CreateCustomPage(
    wpSelectDir,
    'Configuracao do Banco de Dados',
    'Informe os dados de conexao com o SQL Server'
  );

  topo := 8;
  CriarLabel(DbPage, 'Servidor SQL Server (ex: localhost ou 192.168.1.10\SQLEXPRESS):', topo);
  edServer   := CriarEdit(DbPage, topo + 20, 'localhost', False);
  topo := topo + 56;

  CriarLabel(DbPage, 'Nome do banco de dados:', topo);
  edDatabase := CriarEdit(DbPage, topo + 20, 'PortoCabral', False);
  topo := topo + 56;

  chkWinAuth := TCheckBox.Create(DbPage);
  chkWinAuth.Parent   := DbPage.Surface;
  chkWinAuth.Caption  := 'Usar autenticacao do Windows (nao requer usuario/senha)';
  chkWinAuth.Top      := topo;
  chkWinAuth.Left     := 0;
  chkWinAuth.Width    := DbPage.SurfaceWidth;
  chkWinAuth.Checked  := False;
  chkWinAuth.OnClick  := @AtualizarEstado;
  topo := topo + 32;

  CriarLabel(DbPage, 'Usuario SQL Server:', topo);
  edUser     := CriarEdit(DbPage, topo + 20, 'sa', False);
  topo := topo + 56;

  CriarLabel(DbPage, 'Senha:', topo);
  edPassword := CriarEdit(DbPage, topo + 20, '', True);
end;

{ ---- Validacao ao clicar em Avancar ---- }

function NextButtonClick(CurPageID: Integer): Boolean;
begin
  Result := True;
  if CurPageID <> DbPage.ID then Exit;

  if Trim(edServer.Text) = '' then begin
    MsgBox('Informe o endereco do servidor SQL Server.', mbError, MB_OK);
    Result := False; Exit;
  end;
  if Trim(edDatabase.Text) = '' then begin
    MsgBox('Informe o nome do banco de dados.', mbError, MB_OK);
    Result := False; Exit;
  end;
  if (not chkWinAuth.Checked) and (Trim(edUser.Text) = '') then begin
    MsgBox('Informe o usuario SQL Server ou marque autenticacao do Windows.', mbError, MB_OK);
    Result := False; Exit;
  end;
end;

{ ---- Cria application.properties em ssPostInstall (antes do [Run]) ---- }

procedure CriarApplicationProperties;
var
  conteudo: String;
  arquivo:  String;
  dbUrl:    String;
begin
  arquivo := ExpandConstant('{app}\application.properties');

  if chkWinAuth.Checked then
    dbUrl := 'jdbc:sqlserver://' + edServer.Text +
             ':1433;databaseName=' + edDatabase.Text +
             ';integratedSecurity=true;encrypt=false;trustServerCertificate=true'
  else
    dbUrl := 'jdbc:sqlserver://' + edServer.Text +
             ':1433;databaseName=' + edDatabase.Text +
             ';encrypt=false;trustServerCertificate=true';

  conteudo :=
    '# Gerado pelo instalador. Edite aqui para alterar a conexao.' + #13#10 +
    '' + #13#10 +
    'spring.datasource.url=' + dbUrl + #13#10 +
    'spring.datasource.driver-class-name=com.microsoft.sqlserver.jdbc.SQLServerDriver' + #13#10;

  if chkWinAuth.Checked then
    conteudo := conteudo +
      'spring.datasource.username=' + #13#10 +
      'spring.datasource.password=' + #13#10
  else
    conteudo := conteudo +
      'spring.datasource.username=' + edUser.Text + #13#10 +
      'spring.datasource.password=' + edPassword.Text + #13#10;

  conteudo := conteudo +
    '' + #13#10 +
    '# Hibernate cria e atualiza as tabelas automaticamente' + #13#10 +
    'spring.jpa.hibernate.ddl-auto=update' + #13#10 +
    'spring.jpa.show-sql=false' + #13#10 +
    '' + #13#10 +
    '# Servidor web' + #13#10 +
    'server.port=8080' + #13#10 +
    'spring.web.resources.static-locations=classpath:/static/' + #13#10 +
    '' + #13#10 +
    '# Logs' + #13#10 +
    'logging.file.name=${user.home}/PortoCabral/logs/sistema.log' + #13#10 +
    'logging.level.root=WARN' + #13#10 +
    'logging.level.com.sistemaportocabral=INFO' + #13#10;

  SaveStringToFile(arquivo, conteudo, False);
end;

procedure CurStepChanged(CurStep: TSetupStep);
begin
  { ssPostInstall dispara DEPOIS dos arquivos serem copiados e ANTES do [Run] }
  if CurStep = ssPostInstall then
    CriarApplicationProperties;
end;
