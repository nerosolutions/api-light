const axios = require('axios');

module.exports = {
    async invoices(req, res){
        const puppeteer = require("puppeteer-extra");
        var userAgent = require('user-agents');
        const { default: RecaptchaPlugin, BuiltinSolutionProviders } = require("puppeteer-extra-plugin-recaptcha");
        const CapMonsterProvider = require("puppeteer-extra-plugin-recaptcha-capmonster");
        CapMonsterProvider.use(BuiltinSolutionProviders);
        puppeteer.use(
            RecaptchaPlugin({
                provider: {
                    id: "capmonster",
                    token: "54afaddf5f5ddbd65ba17fb5e5aa4895" // REPLACE THIS WITH YOUR OWN CAPMONSTER API KEY ⚡
                },
                visualFeedback: true // colorize reCAPTCHAs (violet = detected, green = solved)
            })
        );

        try {
            const { cpf, codigo } = req.params
        
            config = {
                browser: '',
                page: '',
                desafio: ''
            }

            methods = {
                async main(){
                    await this.initChrome();
                    await this.acessaPagina();
                    // await this.fecha();
                },
                async initChrome(){
                    try {
                        console.log("Opening the browser......");
                        config.browser = await puppeteer.launch({
                            // executablePath: 'C://Program Files//Google//Chrome//Application//chrome.exe',
                            headless: 'new',
                            args: ["--disable-setuid-sandbox"],
                            'ignoreHTTPSErrors': true
                        });
                    } catch (err) {
                        console.log("Could not create a browser instance => : ", err);
                    }
                },
                async acessaPagina(){
                    console.log('-> Acessando página LIGHT.');
                    config.page = await config.browser.newPage();
                    await config.page.goto('https://agenciavirtual.light.com.br/AGV_Segunda_Via_VW/AcessoRapido_SegundaVia.ModalLoginAcessoRapido.aspx?_=1697728387615');

                    await config.page.waitForTimeout(3000)

                    console.log('-> Insere CPF');
                    let inputCPF = await config.page.$('#AGV_Acesso_CW_wt1_block_wt51_OutSystemsUIWeb_wt8_block_wtMainContent_wtConteudo_OutSystemsUIWeb_wt30_block_wtInput_wtInputCPF_CNPJ');
                    await inputCPF.type(cpf)

                    await config.page.waitForTimeout(500)

                    console.log('-> Insere Código');
                    let inputCodigo = await config.page.$('#AGV_Acesso_CW_wt1_block_wt51_OutSystemsUIWeb_wt8_block_wtMainContent_wtConteudo_wtInputPN');
                    await inputCodigo.type(codigo)

                    console.log('-> Resolve Captcha');
                    await config.page.solveRecaptchas();

                    let btnAcessar = await config.page.$('#AGV_Acesso_CW_wt1_block_wt51_OutSystemsUIWeb_wt8_block_wtMainContent_wtActions_wt7');
                    await btnAcessar.click();

                    console.log('-> Resolveu!');
                    await config.page.waitForSelector('#wt1_wt2_OutSystemsUIWeb_wt6_block_wtMainContent_wtConteudo_wt7_wt47')

                    let faturasBtn = await config.page.$('#wt1_wt2_OutSystemsUIWeb_wt6_block_wtMainContent_wtConteudo_wt7_wtInstalacaoListRecords_ctl00_OutSystemsUIWeb_wt48_block_wtContent_AGV_Componentes_comuns_wt25_block_wt5 > div.accordion-item-icon');
                    await faturasBtn.click();
                    await config.page.waitForTimeout(1000)


                    console.log('-> Tira Print');
                    await config.page.screenshot({
                        path: 'screenshot.jpg',
                      });
                    
                    await config.page.waitForTimeout(3000000)
                    await this.acessa();
                },
                async fecha(){
                    console.log('-> Fechando navegador!');
                    await config.browser.close();
                }
            }

            methods.main();
        } catch (error) {
            res.json({ erro: 'Dados incorretos!' })
        }
        
        
    },
}