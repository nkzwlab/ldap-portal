export type Language = "en" | "ja";

export const translations = {
  en: {
    nav: {
      loggedInAs: (name: string) => `Logged in as: ${name}`,
      notLoggedIn: "Not logged in",
      logOut: "Log out",
      logOutConfirm: "Are you sure you want to log out?",
    },
    home: {
      linksSection: "Quick Links",
      settingsSection: "Settings",
      vpn: {
        title: "JNNET VPN",
        description: "Go to JNNET VPN (WireGuard).",
        link: "VPN",
      },
      gpuTracker: {
        title: "GPU Tracker",
        description: "GPU usage across each server. (VPN required)",
        link: "GPU Tracker",
      },
      wiki: {
        title: "JNOKLab Wiki",
        description: "Wiki for Nakazawa-Okoshi Lab. (VPN required)",
        link: "Wiki",
      },
      password: {
        title: "Password Change",
        description: "Change your Linux, VPN, and Samba password.",
        link: "Password",
      },
      shell: {
        title: "Shell Change",
        description: "Change your Linux login shell.",
        link: "Shell",
      },
      pubkey: {
        title: "SSH Public Key",
        description: "Register your Linux SSH public key.",
        link: "Pubkey",
      },
    },
    login: {
      title: "Log in",
      loginName: "Login name",
      password: "Password",
      submit: "Submit",
      noAccount: "Don't have account yet?",
      createAccount: "Create an account",
      errorInvalidCredentials: "Invalid login name or password",
      errorGeneric: "An error occured while authenticating",
    },
    password: {
      title: "Update Password",
      currentPassword: "Current Password",
      newPassword: "New Password",
      confirmPassword: "Confirm new password",
      submit: "Submit",
      successMessage: "Updated password successfully.",
      errorInvalidCredentials: "Invalid login name or password",
      errorGeneric: "An error occured while authenticating",
    },
    pubkey: {
      title: "Add/Remove SSH public key",
      publicKeyLabel: (n: number) => `Public key ${n}`,
      add: "Add",
      delete: "DELETE",
      submit: "Submit",
      successMessage: "Updated SSH pubkeys successfully.",
    },
    register: {
      title: "Registration",
      loginName: "Login name",
      password: "Password",
      passwordConfirmation: "Password confirmation",
      submit: "Submit",
      successMessage:
        "Registration form has been sent successfully. Redirecting to login page in 6s.",
      errorDuplicate:
        "This login name is already registered. Redirecting to login page in 6s.",
      errorGeneric: "An error occured while submitting the form",
      notice:
        "Your submission will be notified to the operators. Once operators approved your application, you will be able to login to the service.",
    },
    approve: {
      title: "Approval",
      loginName: "Login name",
      email: "Email",
      approveHeader: "Approve",
      declineHeader: "Decline",
      noEmail: "(Not entered)",
      approveButton: "Approve",
      approvedButton: "Approved",
      declineButton: "Decline",
      declinedButton: "Declined",
      approveSuccess: (name: string) =>
        `Approved application from ${name} successfully.`,
      approveError: (name: string, error: string) =>
        `Failed to approve application from ${name}: ${error}`,
      declineSuccess: (name: string) =>
        `Declined application from ${name}.`,
      declineError: (name: string, error: string) =>
        `Failed to decline application from ${name}: ${error}`,
    },
    shell: {
      title: "Change login shell",
      shellLabel: "Shell",
      submit: "Submit",
      successMessage: "Updated login shell successfully.",
    },
  },
  ja: {
    nav: {
      loggedInAs: (name: string) => `ログイン中: ${name}`,
      notLoggedIn: "ログインしていません",
      logOut: "ログアウト",
      logOutConfirm: "ログアウトしますか？",
    },
    home: {
      linksSection: "クイックリンク",
      settingsSection: "各種設定",
      vpn: {
        title: "JNNET VPN",
        description: "JNNETのVPN（WireGuard）に移動",
        link: "VPN",
      },
      gpuTracker: {
        title: "GPU Tracker",
        description: "各GPUサーバーの使用状況ダッシュボード（要VPN）",
        link: "GPU Tracker",
      },
      wiki: {
        title: "JNOKLab Wiki",
        description: "中澤・大越研のWiki（要VPN）",
        link: "Wiki",
      },
      password: {
        title: "パスワード変更",
        description: "Linux、VPN、Sambaのパスワード変更",
        link: "パスワード",
      },
      shell: {
        title: "シェル変更",
        description: "Linuxのログインシェルの変更",
        link: "シェル",
      },
      pubkey: {
        title: "公開鍵登録",
        description: "LinuxのSSHの公開鍵登録",
        link: "公開鍵",
      },
    },
    login: {
      title: "ログイン",
      loginName: "ログイン名",
      password: "パスワード",
      submit: "送信",
      noAccount: "アカウントをお持ちでない方は",
      createAccount: "アカウント作成",
      errorInvalidCredentials: "ログイン名またはパスワードが正しくありません",
      errorGeneric: "認証中にエラーが発生しました",
    },
    password: {
      title: "パスワード変更",
      currentPassword: "現在のパスワード",
      newPassword: "新しいパスワード",
      confirmPassword: "新しいパスワード（確認）",
      submit: "送信",
      successMessage: "パスワードを変更しました。",
      errorInvalidCredentials: "ログイン名またはパスワードが正しくありません",
      errorGeneric: "認証中にエラーが発生しました",
    },
    pubkey: {
      title: "SSH公開鍵の追加/削除",
      publicKeyLabel: (n: number) => `公開鍵 ${n}`,
      add: "追加",
      delete: "削除",
      submit: "送信",
      successMessage: "SSH公開鍵を更新しました。",
    },
    register: {
      title: "ユーザー登録",
      loginName: "ログイン名",
      password: "パスワード",
      passwordConfirmation: "パスワード（確認）",
      submit: "送信",
      successMessage:
        "登録申請を送信しました。6秒後にログインページへ移動します。",
      errorDuplicate:
        "このログイン名は既に登録されています。6秒後にログインページへ移動します。",
      errorGeneric: "フォームの送信中にエラーが発生しました",
      notice:
        "申請内容は管理者に通知されます。管理者が承認すると、サービスにログインできるようになります。",
    },
    approve: {
      title: "承認",
      loginName: "ログイン名",
      email: "メールアドレス",
      approveHeader: "承認",
      declineHeader: "却下",
      noEmail: "（未入力）",
      approveButton: "承認",
      approvedButton: "承認済み",
      declineButton: "却下",
      declinedButton: "却下済み",
      approveSuccess: (name: string) => `${name} の申請を承認しました。`,
      approveError: (name: string, error: string) =>
        `${name} の申請の承認に失敗しました: ${error}`,
      declineSuccess: (name: string) => `${name} の申請を却下しました。`,
      declineError: (name: string, error: string) =>
        `${name} の申請の却下に失敗しました: ${error}`,
    },
    shell: {
      title: "ログインシェルの変更",
      shellLabel: "シェル",
      submit: "送信",
      successMessage: "ログインシェルを変更しました。",
    },
  },
};

export type Translations = typeof translations.en;
