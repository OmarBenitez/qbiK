function readURL(input) {

    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function(e) {
            $('.banner')
                    .css("background-image", "url(" + e.target.result + ")");
        }
        reader.readAsDataURL(input.files[0]);

    } else {
        var filename = "";
        filename = "file:\/\/" + input.value;
        document.form2.previewImg.src = filename;
        document.form2.previewImg.style.width = "130px";

    }
}

$(function() {
    $('input[type="file"]').inputfile({
        uploadText: '<span class="glyphicon glyphicon-upload"></span> Select a file',
        removeText: '<span class="glyphicon glyphicon-trash"></span>',
        restoreText: '<span class="glyphicon glyphicon-remove"></span>',
        uploadButtonClass: 'btn btn-primary',
        removeButtonClass: 'btn btn-default'
    });
});
