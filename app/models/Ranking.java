package models;

import play.modules.morphia.Model;

/**
 *
 * @author Beny
 */
public class Ranking extends Model {

    public Integer positivos;

    public Integer negativos;

    public Ranking() {
        this.negativos = 0;
        this.positivos = 0;
    }

}
