from math import ceil


def paginate_query(query, page: int, page_size: int):
    total = query.count()
    total_pages = max(1, ceil(total / page_size)) if total else 1
    items = query.offset((page - 1) * page_size).limit(page_size).all()
    return {
        'items': items,
        'page': page,
        'page_size': page_size,
        'total': total,
        'total_pages': total_pages,
    }
