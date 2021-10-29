class search {
    static base(el,url,haveUrl=true){
        let search_fun=formatRepo;
        let template_fun=formatRepoSelection;
        if(haveUrl){
            $(`#${el}`).select2({
                ajax: {
                    url: url,
                    dataType: 'json',
                    processResults: function (data) {
                        data=data.map(item=>{
                            item.id=item._id;
                            return item;
                        });
                        return {
                            results: data
                        };
                    },
                    headers: {
                        uuid:"test"
                    },
                },
                templateResult: search_fun,
                templateSelection: template_fun
            });
        }
        else{
            $(`#${el}`).select2()
        }

    }
}
function formatRepoSelection (repo) {
    return repo.val
}
function formatRepo (repo) {
    if (repo.loading) {
        return repo.text;
    }
    var $container = $(
        "<div class='select2-result-repository clearfix'>" +
        "<div class='select2-result-repository__meta'>" +
        "<span class='select2-result-repository__title'></span>" +
        " "+
        "<span class='select2-result-repository__description'></span>" +

        "</div>" +
        "</div>"
    );
    $container.find(".select2-result-repository__title").text(repo.val);
    return $container;
}

