package nbm.cash.admin.modular.controller;

import nbm.cash.admin.common.utils.http.RespCodeEnum;
import nbm.cash.admin.common.utils.http.WebMessage;
import nbm.cash.admin.modular.service.impl.BetServiceImpl;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.util.ArrayList;
import java.util.List;


/**
 * @Description 文件上传
 * @ClassName FilesController
 * @Author New
 * @Date 2019/12/23 11:38
 * @Version V1.0
 **/
@RestController
@RequestMapping("/file")
public class FilesController {

    protected static final Logger logger = LogManager.getLogger(FilesController.class);

    @Value("${file.upload.path}")
    private String filePath;

    @RequestMapping("/upload")
    @ResponseBody
    public WebMessage filesUpload(@RequestParam("files") MultipartFile[] files, String property) {
        try {
            List<String> fileNames = new ArrayList<String>();
            String savePath = property + File.separator;
            if(files != null && files.length > 0) {

                // 判断路径存不存在，不存在则新建
                File newPath = new File(filePath  + savePath + "" + files[0].getOriginalFilename());
                if(!newPath.getParentFile().exists()){
                    newPath.getParentFile().mkdirs();
                }

                for (MultipartFile file : files) {
                    String fileName = System.currentTimeMillis() + "__" + file.getOriginalFilename() + "";
                    File f = new File(filePath + savePath + fileName);
                    file.transferTo(f);
                    fileNames.add(savePath + fileName);
                }
            }
            return WebMessage.success(fileNames);
        } catch (Exception e) {
            logger.error("cuoWu", e);
        }
        return WebMessage.construct(RespCodeEnum.ERROR);
    }
}