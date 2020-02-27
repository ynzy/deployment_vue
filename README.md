# 阿里云服务器一键部署vue项目
## 1.生成vue项目demo
```js
vue create my-project
```
## 2.上传vue项目到github
```js
git remote add origin https://github.com/ynzy/deployment.git
git push -u origin master
```
## 3.本地生成公钥和私钥
```js
 ssh-keygen -t rsa -C autodeployment -f deployment
-------------
Generating public/private rsa key pair.
Enter passphrase (empty for no passphrase):
Enter same passphrase again:
Your identification has been saved in deployment.  // 私钥
Your public key has been saved in deployment.pub. // 公钥
The key fingerprint is:
SHA256:egPfdeoMwy8eaCMnA07kZp1cgL7i/2PZmGWAI3eD0y8 autodeployment
The key's randomart image is:
+---[RSA 2048]----+
|     ..          |
|    .  .         |
|   ..+  .        |
|  .oBo=o         |
|   o*==+S   . .  |
|  .=..E+++ . o   |
| . .. =OO * .    |
|  .   *B.o.B     |
|   ..o.. ...+    |
+----[SHA256]-----+

```
1. 查看所有文件
```js
ls -la
-----------------
drwxr-xr-x 1 Administrator 197121        0 5月   1  2019  .ssh/
-rw-r--r-- 1 Administrator 197121     1679 2月  27 14:51  deployment
-rw-r--r-- 1 Administrator 197121      397 2月  27 14:51  deployment.pub
```
2. 进入`.ssh`目录将`deployment`拷贝进去
```js
// 拷贝 要拷贝的文件目录 拷贝到的文件目录，.代表当前目录
cp ~/deployment .
```
## 4.返回根目录，把公钥拷贝到远端服务器
```js
// 拷贝到远端  拷贝的文件  服务器用户名@服务器地址:当前目录
scp deployment.pub root@47.95.119.112:.
```
1. 把公钥写入远端服务器.ssh目录下
* 进入.ssh目录查看有没有`authorized_keys`文件，没有则创建一个
```js
ls -la 
------------
total 8
drwx------  2 root root 4096 Dec 25 03:27 .
dr-xr-x---. 5 root root 4096 Feb 27 15:05 ..
-rw-------  1 root root    0 Feb 16 08:05 authorized_keys
```
* 返回上一级执行写入命令
```js
cat deployment.pub >> ~/.ssh/authorized_keys
```
## 5.拷贝本地私钥到github
* 找到私钥文件，复制到github
* github项目地址->settings->Secrets
* 添加私钥
```js
name:ALYUN
value:私钥
```
## 开启workflow自动工作流
* 项目中找到actions -> node.js
* 点击之后会生成一个文件
```yml
name: Node.js CI # 自动部署名字

on: [push]  # 发生push时，执行git push命令会触发这里

jobs:
  build:

    runs-on: ubuntu-latest  //运行的系统

    strategy:
      matrix:
        node-version: [8.x, 10.x, 12.x]  # nodejs版本，写几个版本号测试几次，我们用12.x就可以了

    steps:
    - uses: actions/checkout@v2
    - name: Use Node.js ${{ matrix.node-version }}
      uses: actions/setup-node@v1
      with:
        node-version: ${{ matrix.node-version }}
    - run: npm install
    - run: npm run build --if-present
    - run: npm test
      env:
        CI: true
# 需要写的一些配置
    - name: Deploy  //当前插件名字
      uses: easingthemes/ssh-deploy@v2.0.7  //使用这个人开发的一个插件
      env: 
        SSH_PRIVATE_KEY: ${{ secrets.ALYUN }}  # 秘钥名字
        ARGS: "-rltgoDzvO --delete" # 固定配置
        SOURCE: "dist/"  # 项目打包之后的目录
        REMOTE_HOST: "47.95.119.112" # 服务器地址
        REMOTE_USER: "root" # 服务器用户
        TARGET: "/www/autodeploy" # 指定服务器目录
```