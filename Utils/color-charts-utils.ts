export class ColorChartUtils{

    chartColor: Map <String,String>;

    public constructor(){
      this.chartColor = new Map<string, string>(); 
      this.chartColor.set("Milho","#f4bf02");
      this.chartColor.set("Algodao","#b1f9f8");
      this.chartColor.set("Soja","#02e232");
      this.chartColor.set("Feijao","#caf202");
      this.chartColor.set("Pecuaria","#e8e402");
      this.chartColor.set("Cafe","");
      this.chartColor.set("Horti","#99ff00");
      this.chartColor.set("Outros","#9e01f1");
      this.chartColor.set("areaPropria","#02e232");
      this.chartColor.set("areaArrendada","#f4bf02");
      this.chartColor.set("John Deere","rgba(8, 117, 12, 0.7)");
      this.chartColor.set("Case","#f94a8f");
      this.chartColor.set("New Holland","rgb(255, 251, 0)");
      this.chartColor.set("Valtra","rgb(255, 174, 0)");
      this.chartColor.set("Massey Ferguson","rgb(132, 0, 255)");
      this.chartColor.set("Stara","rgb(0, 255, 200)");
      this.chartColor.set("Jacto","#02e232");
      this.chartColor.set("GP","rgba(8, 117, 12, 0.7)");
      this.chartColor.set("PP","rgb(255, 251, 0)");
      this.chartColor.set("Mega","rgba(8, 117, 12, 0.7)");
      this.chartColor.set("Medio","rgb(0, 255, 200)");
      this.chartColor.set("Pequeno","rgb(255, 174, 0)");
      this.chartColor.set("Grande","#02e232");
      this.chartColor.set("green","rgba(8, 117, 12, 0.7)");
      this.chartColor.set("soft_green","#99ff00");
      this.chartColor.set("red","red");
      this.chartColor.set("yellow","rgb(255, 251, 0)");

      this.chartColor.set("rgba(8, 117, 12, 0.7)","green");
      this.chartColor.set("#99ff00","soft_green");
      this.chartColor.set("rgb(255, 251, 0)","yellow");

      this.chartColor.set("-99 CV","rgba(8, 117, 12, 0.7)");
      this.chartColor.set("100 - 200 CV","rgb(255, 251, 0)");
      this.chartColor.set("200 - 300 CV","#99ff00");
      this.chartColor.set("300 - 400 CV","rgb(255, 174, 0)");
      this.chartColor.set("+400 CV","#f94a8f");


      
  }
  

 public static getRandomColor() {
      var letters = '0123456789ABCDEF';
      var color = '#';
      for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 15)];
      }
      return color;
    }
}