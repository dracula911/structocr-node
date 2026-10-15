# 发版流程

在 GitHub 上发布一个 Release，GitHub Actions（`.github/workflows/publish.yml`）就会自动把新版本发布到 npm。不需要本地环境，也不需要 token。

## 一次性设置（只做一次）

自动发布用的是 npm 的 Trusted Publishing（可信发布），GitHub 里不存任何 token，但需要先在 npmjs.com 上授权这个仓库：

npmjs.com → 包 **structocr** → Settings → Trusted Publisher → GitHub Actions：

| 字段 | 值 |
| --- | --- |
| Organization or user | `dracula911` |
| Repository | `structocr-node` |
| Workflow filename | `publish.yml` |
| Environment name | 留空 |

没做这一步，自动发布会在最后上传时失败。

## 每次发版

1. **改版本号**：新开一个分支，修改 `package.json` 和 `package-lock.json` 里的 `version`（推荐用 `npm version 1.9.2 --no-git-tag-version`，两个文件会一起改），提 PR 并合并到 `main`。
   - 版本号规则：只改文档或修 bug 加第三位（1.9.1 → 1.9.2），加新方法或新参数加第二位（1.9.2 → 1.10.0），不兼容的改动加第一位。
   - 同一个版本号在 npm 上只能发布一次，发过就不能覆盖，哪怕删掉也不行。
2. **发 Release**：GitHub 仓库页面 → Releases → Draft a new release。
   - Tag：填 `v` + 版本号，例如 `v1.9.2`，选择 "Create new tag on publish"，目标分支 `main`。
   - Title：同 tag 即可，描述里写这次改了什么。
   - 点 **Publish release**。
3. **看结果**：仓库 → Actions → "Publish to npm"，几分钟内跑完。流程依次是：
   1. 检查 tag 和代码里的版本号是否一致，不一致就停止；
   2. 跑测试；
   3. 打包并发布。
4. **确认上线**：打开 https://www.npmjs.com/package/structocr，或者看 `https://registry.npmjs.org/structocr/latest` 里的版本号。npm 的页面有时要过几分钟才更新。

## 出错怎么办

- **"Release tag … does not match version …"**：tag 和代码版本号不一致。到 Releases 里删掉这个 Release，再到 Tags 里删掉对应的 tag；把版本号改对、合并后，重新发 Release。
- **测试失败**：什么都没有发布。修好代码合并后，删掉 Release 和 tag，重新发。
- **上传失败（403 / "trusted publisher" 相关报错）**：检查上面的一次性设置，仓库名、workflow 文件名是否完全一致。设置好后在 Actions 里点 **Re-run jobs** 即可，不用重新发 Release。
- **版本号已存在**：说明这个版本发过了，只能改一个新的版本号再发。

## 手动发布（备用）

自动发布不可用时，在本地仓库根目录执行：

```bash
npm login
npm whoami   # 应显示 draculazmm
git checkout main
git pull
npm ci
npm publish
```

注意是 `npm login`，不是 `node login`。

发布前确认版本号：`node -p "require('./package.json').version"`。本地跑测试：`npm ci && npm test`。
