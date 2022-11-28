import axios from 'axios';
export default  async function imageApi(searchQuery, page) {
    const response = await axios
        .get("https://pixabay.com/api/",
                {
                    params: {
                        key: "27500095-0ff642ee8d6c39f05f430f005",
                        q:`${searchQuery}`,
                        image_type:"photo",
                        orientation: "horizontal",
                        safesearch: "true",
                        page: `${page}`,
                        per_page:"40"  //40
                    }
            });
   
    return response.data
    
}
