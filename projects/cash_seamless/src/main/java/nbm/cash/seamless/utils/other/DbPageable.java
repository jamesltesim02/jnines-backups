package nbm.cash.seamless.utils.other;

import java.io.Serializable;

import nbm.cash.seamless.request.PageModel;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

/**
 * @Auther:
 * @Date: 2018/8/22 10:19
 * @Description:
 * @Version: 1.0
 */
public class DbPageable implements Serializable, Pageable {
    /**
     * @Fields: serialVersionUID
     * @Todo: TODO
     */
    private static final long serialVersionUID = 1L;

    PageModel page;

    public PageModel getPage() {
        return page;
    }

    public void setPage(PageModel page) {
        this.page = page;
    }

    @Override
    public Pageable first() {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public long getOffset() {
        // TODO Auto-generated method stub
        return (long) (page.getPageNumber() - 1) * page.getPageSize();
    }

    @Override
    public int getPageNumber() {
        // TODO Auto-generated method stub
        return page.getPageNumber();
    }

    @Override
    public int getPageSize() {
        // TODO Auto-generated method stub
        return page.getPageSize();
    }


    @Override
    public boolean hasPrevious() {
        // TODO Auto-generated method stub
        return false;
    }

    @Override
    public Pageable next() {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public Pageable previousOrFirst() {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public Sort getSort() {
        // TODO Auto-generated method stub
        return page.getSort();
    }
}
