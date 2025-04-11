# two-mern-social.git

## 4.11.2025

## echo "# two-mern-social" >> README.md
git init
git add README.md
git commit -m "first commit"
git branch -M main
git remote add origin git@github.com:nelsonlopezjimenez/two-mern-social.git
git push -u origin main

## ssh-keygen for localepsilon at 0768
~/.ssh/config edit
/c/Users/Public/_AFTER-IMAGE/2025-APRIL/home-dot-ssh-config.txt
Host github.com
        User nelsonlopezjimenez
        IdentityFile ~/.ssh/id_ed25519

## two-mern-social
1. backend-mern-social
1. frontend-mern-social

## backend-mern-social
6b8aa4b /api/v2 added to /routes/auth, post, user
e8ad1b3 3333 /api/users/ get route OK
This corresponds to an older version. I will have to find the newer version with /v2/routes added circumventing the authorization/validation

## frontend-mern-social
6f053d6 giving up on router v6
810adb8 Migrating from mui 4 to 5 and react-router-dom to 6
73f7f24 Initialize project using create React App.
Also older version. I will refactor to delete router, mui, and use vite react install
