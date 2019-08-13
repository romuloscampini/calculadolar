(function($) {
    $("#calculate-btn").click(function(){
        $.LoadingOverlay("show");
        var i = 1;
        var today;
        do{
            var yesterdayIsWeekend = moment().subtract(i,'days')._d.getDay()%6==0;
            today = moment().subtract(i,'days').format('MM-DD-YYYY');
            i++;
        }while(yesterdayIsWeekend);
        var url = "https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoDolarDia(dataCotacao=@dataCotacao)?@dataCotacao='"+today+"'&$top=100&$format=json&$select=cotacaoVenda";
        $.getJSON( url, function( data ) {
            $.LoadingOverlay("hide");
            if(data.value.length > 0) {
                var dolar = $('#dolar').val();
                var sum1 = dolar * data.value[0].cotacaoVenda;
                var sum2 = (sum1/100) * 4;
                var sum3 = sum1 + sum2;
                var sum4 = (sum3/100) * 6.38;
                var sum5 = sum4 + sum3;
                var total = sum5.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL'})
                $('#total').val(total);
                var description = '(R$ ' + data.value[0].cotacaoVenda + ' + 4% spread NuBank+ 6.38% IOF)'
                $('#description').text(description);
            } else {
                bootbox.alert("Cotação do dólar comercial não disponibilizada pelo BCB para o dia de hoje.");
            }
        });
    });
})(jQuery);