* 回滚文件
```bash
git checkout -- filepath
```

* 分支
```bash
# 创建分支
git branch branch_name
# 切换分支
git checkout branch_name
# 创建并切换分支,上面两条命令合并体, 加-b参数
git checkout -b branch_name
# 也可以使用switch切换分支
git switch branch_name
# 使用switch创建并切换分支, 加-c参数
git switch -c branch_name
# 删除分支
git branch -d branch_name
# 合并分支
git merge source_branch_name
# 推送分支到远端
git push origin master
git push origin dev
# 暂存当前分支更新
git stash
# 查看暂存列表
git stash list
# 恢复暂存不删除(可多次恢复)
git stash aplly stath_id
# 恢复暂存并删除
git stash pop
```
* 
