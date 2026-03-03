import { useQuery } from "@tanstack/react-query"
import { getProductsAction } from "../actions/get-products.action"
import { useParams, useSearchParams } from "react-router"


export const useProducts = () => {

    // TODO: Logica a desarrollar
    const { gender } = useParams();
    const [searchParams] = useSearchParams();

    let limit = searchParams.get('limit') || 9;
    let page = searchParams.get('page') || 1;
    const query = searchParams.get('query') || undefined;

    const sizes = searchParams.get('sizes') || undefined;
    const price = searchParams.get('price') || 'any';
    let minPrice = undefined;
    let maxPrice = undefined;

    switch (price) {
        case 'any':
            break;
        case '0-50':
            minPrice = 0;
            maxPrice = 50;
            break;
        case '50-100':
            minPrice = 50;
            maxPrice = 100;
            break;
        case '100-200':
            minPrice = 100;
            maxPrice = 200;
            break;
        case '200+':
            minPrice = 200;
            break;
        default:
            break;
    }

    if (isNaN(+limit)) limit = 9
    if (isNaN(+page)) page = 1

    const offset = (Number(page) - 1) * Number(limit);

    return useQuery({
        queryKey: ['products', { offset, limit, gender, sizes, minPrice, maxPrice, query }],
        queryFn: () => getProductsAction({
            limit,
            offset,
            gender,
            sizes,
            minPrice,
            maxPrice,
            query,
        }),
        staleTime: 1000 * 60 * 5,
    })

}