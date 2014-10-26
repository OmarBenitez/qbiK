package models;

import play.modules.morphia.Model;

/**
 *
 * @author Beny
 */
public class Ranking extends BaseModel {

    public Integer positivos;

    public Integer negativos;

    public Integer total;

    public Ranking() {
        this.negativos = 0;
        this.positivos = 0;
    }

    public void masUno() {
        this.positivos++;
        upTotal();
    }

    public void menosUno() {
        this.negativos++;
        upTotal();
    }

    private void upTotal(){
        this.total = this.positivos - this.negativos;
    }
    
}
