package nbm.cash.admin.common.utils.other;

import java.util.ArrayList;
import java.util.List;

/**
 * @program: cash_seamless
 * @description: 分页使用到的Page类
 * @author: Mr.Nat
 * @create: 2019-11-19 14:55
 **/
public class PageBean<T> {
    // 1.当前页数 从页面获取
    private Integer currentPage;
    // 2.每页显示数据个数，赋初值或者setter获取
    private Integer currentCount;
    // 3.总条数，从数据库获取
    private Long totalRecord;
    // 4.总页数，计算得到
    /* private int totalPage;*/
    // 5.每页的显示数据，数据库得到
    List<T> list = new ArrayList<>();

    public Integer getCurrentPage() {
        return currentPage;
    }

    public void setCurrentPage(Integer currentPage) {
        this.currentPage = currentPage;
    }

    public Integer getCurrentCount() {
        return currentCount;
    }

    public void setCurrentCount(Integer currentCount) {
        this.currentCount = currentCount;
    }

    public Long getTotalRecord() {
        return totalRecord;
    }

    public void setTotalRecord(Long totalRecord) {
        this.totalRecord = totalRecord;
    }

    public List<T> getList() {
        return list;
    }

    public void setList(List<T> list) {
        this.list = list;
    }

    public PageBean(Integer currentPage, Integer currentCount, Long totalRecord, List<T> list) {
        this.currentPage = currentPage;
        this.currentCount = currentCount;
        this.totalRecord = totalRecord;
        this.list = list;
    }
}
