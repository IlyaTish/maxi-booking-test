<template lang='pug'>
  #app
    md-content
      .md-content-wrapper
        .md-card-wrapper
          h2.md-title Курс евро (EUR)
          md-card.md-with-hover
            md-ripple
              .md-layout
                .md-layout-item
                  span.md-subtitle Дата
                  span.md-txt {{ commonData.date }}

                .md-layout-item.charcode-col
                  span.md-subtitle Код
                  template(v-if='valutesData_xml.loaded')
                    span.md-txt {{ valutesData_xml.EUR.CharCode[0] }}
                  template(v-else-if='valutesData_json_js.loaded')
                    span.md-txt {{ valutesData_json_js.EUR.CharCode }}
                  template(v-else)
                    span.md-txt EUR

                .md-layout-item.nominal-col
                  span.md-subtitle Номинал
                  template(v-if='valutesData_xml.loaded')
                    span.md-txt {{ valutesData_xml.EUR.Nominal[0] }}
                  template(v-else-if='valutesData_json_js.loaded')
                    span.md-txt {{ valutesData_json_js.EUR.Nominal }}
                  template(v-else)
                    span.md-txt -

                .md-layout-item.value-col
                  span.md-subtitle Курс
                  template(v-if='valutesData_xml.loaded')
                    span.md-txt.bold {{ valutesData_xml.EUR.Value[0] }}
                  template(v-else-if='valutesData_json_js.loaded')
                    span.md-txt.bold {{ valutesData_json_js.EUR.Value }}
                  template(v-else)
                    span.md-txt.bold 00


        .md-card-wrapper
          h2.md-title Курс доллара США (USD)
          md-card.md-with-hover
            md-ripple
              .md-layout
                .md-layout-item
                  span.md-subtitle Дата
                  span.md-txt {{ commonData.date }}

                .md-layout-item.charcode-col
                  span.md-subtitle Код
                  template(v-if='valutesData_xml.loaded')
                    span.md-txt {{ valutesData_xml.USD.CharCode[0] }}
                  template(v-else-if='valutesData_json_js.loaded')
                    span.md-txt {{ valutesData_json_js.USD.CharCode }}
                  template(v-else)
                    span.md-txt USD

                .md-layout-item.nominal-col
                  span.md-subtitle Номинал
                  template(v-if='valutesData_xml.loaded')
                    span.md-txt {{ valutesData_xml.EUR.Nominal[0] }}
                  template(v-else-if='valutesData_json_js.loaded')
                    span.md-txt {{ valutesData_json_js.EUR.Nominal }}
                  template(v-else)
                    span.md-txt -

                .md-layout-item.value-col
                  span.md-subtitle Курс
                  template(v-if='valutesData_xml.loaded')
                    span.md-txt.bold {{ valutesData_xml.USD.Value[0] }}
                  template(v-else-if='valutesData_json_js.loaded')
                    span.md-txt.bold {{ valutesData_json_js.USD.Value }}
                  template(v-else)
                    span.md-txt.bold 00
</template>

<script>
const axios       = require('axios'),
      parseString = require('xml2js').parseString

const getSource = (arr, index, arrToPush, context) => {
  axios
    .get(arr[index], {
      timeout: 60000
    })
    .then(res => {
      if (res.headers['content-type'] === 'text/xml') {
        parseString(res.data, (err, result) => {
          if (result.ValCurs.Valute[11]) {
            context.$set(context.valutesData_xml, 'EUR', result.ValCurs.Valute[11])
          }

          if (result.ValCurs.Valute[10]) {
            context.$set(context.valutesData_xml, 'USD', result.ValCurs.Valute[10])
          }
          arrToPush.push(result)
          context.valutesData_xml.loaded = true
        })
      }
      
      else {
        if (res.data.Valute.EUR) {
          context.$set(context.valutesData_json_js, 'EUR', res.data.Valute.EUR)
        }

        if (res.data.Valute.USD) {
          context.$set(context.valutesData_json_js, 'USD', res.data.Valute.USD)
        }
        arrToPush.push(res.data)
      }
      context.valutesData_json_js.loaded = true
    })
    
    .catch(error => {
      if (index < arr.length - 1) {
        return getSource(arr, index + 1, arrToPush, context);
      }
      throw error;
    });

  setTimeout(() => {
    getSource(arr, index, arrToPush, context)
  }, 10000)
}

export default {
  name: 'App',
  data () {
    return {
      interval: null,
      commonData: {
        date: ''
      },
      valutesData_xml: {
        loaded: false
      },
      valutesData_json_js: {
        loaded: false
      },
      sourcesData: [],
      sources: [
        'https://www.cbr-xml-daily.ru/daily_utf8.xml',
        'https://www.cbr-xml-daily.ru/daily_json.js'
      ]
    }
  },

  methods:{
    dateFunction: (context) => {
      const today       = new Date(),
            currentDate = today.getDate()+'.'+(today.getMonth()+1)+'.'+today.getFullYear();

      context.commonData.date = currentDate;
    }
  },

  mounted: function() {
    const self = this;

    getSource(self.sources, 0, self.sourcesData, self);
    this.dateFunction(self)
  }
}
</script>

<style lang='stylus'>
body
  height 100%
  font-family Roboto, sans-serif
  -webkit-font-smoothing:antialiased
  -moz-osx-font-smoothing grayscale

#app
  width 100%
  height 100%
  color #2c3e50

.md-content
  width 100%
  height 100%
  padding 40px

.md-content-wrapper
  display flex
  flex-wrap wrap
  grid-gap 20px

.md-card-wrapper
  width 400px

.md-card
  width 100%
  display block

.md-ripple
  padding 10px

.md-layout
  grid-gap: 14px

.charcode-col, .nominal-col
  max-width 70px

.md-title
  margin 0 0 16px
  color #000000

.md-subtitle
  width 100%
  display inline-block
  color #8D96B2
  font-size 12px
  line-height 12px

.md-txt
  width 100%
  display inline-block
  margin 6px 0 0
  color #303030
  font-size: 16px

.bold
  font-weight 600
</style>
