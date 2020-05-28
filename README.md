# NFe2CSV

**NFe2CSV** é um aplicativo para extrair alguns dados de um ou mais *XML* no padrão [*NF-e*](https://www.nfe.fazenda.gov.br/portal/principal.aspx), da Secretaria da Fazenda 
do Brasil, para um arquivo [**CSV**](https://pt.wikipedia.org/wiki/Comma-separated_values) (*Comma-separeted values*) 
que então pode ser aberto em qualquer aplicativo de planilha eletrônica.

O arquivo **CSV** resultante usa o "**;**" (ponto-e-vírgula) como separador das colunas e as **"** (aspas duplas) 
como delimitador para colunas alfanuméricas. Para facilitar a importação do arquivo nas planilhas eletrônicas, todos 
os campos são tratados como alfanuméricos.

Na aba *releases*, estão disponíveis pacotes binários para Windows.

## Formato do Arquivo CSV

A primeira linha do arquivo **CSV** contém os nomes dos campos extraídos da **NF-e**.

Se a **NF-e** tem mais de um produto, os dados de *cabeçalho* vão se repetir 
na mesma quantidade dos produtos, por exemplo, uma **NF-e** com dois produtos:

| NF-serie | NF-nNF | NF-dhEmi   | (...) | cProd | xProd  | vProd   | (...) |
| -------- | ------ | ---------  | ----- | ----- | ------ | ------- | ----- |
| 2        | 11111  | 25/05/2020 | ..... | 1     | Item 1 | 25.50   | ..... |
| 2        | 11111  | 25/05/2020 | ..... | 2     | Item 2 | 26      | ..... |
| 2        | 11121  | 27/05/2020 | ..... | 1     | Item 1 | 30.20   | ..... |
