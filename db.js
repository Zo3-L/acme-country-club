const Sequelize = require('sequelize');
const { DataTypes: { DATE, STRING, UUID, UUIDV4 } } = Sequelize;
const conn = new Sequelize(process.env.DATABASE_URL || 'postgres://localhost/acme-country-club',{logging:false});

const members = ['moe', 'lucy', 'larry', 'ethyl'];
const facilities = ['tennis', 'ping-pong', 'raquet-ball', 'bowling'];


const Facility = conn.define('facility',{
    id:{
        type: UUID,
        primaryKey: true,
        defaultValue: UUIDV4
    },
    name:{
        type: STRING,
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: true
        }
    }
})

const Member = conn.define('member',{
    id:{
        type: UUID,
        primaryKey: true,
        defaultValue: UUIDV4
    },
    first_name:{
        type: STRING,
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: true
        }
    }
})

const Booking = conn.define ('booking',{
    id:{
        type: UUID,
        primaryKey: true,
        defaultValue: UUIDV4
    },
    startTime:{
        type: DATE,
        allowNull: false,
        defaultValue: function(){
          return new Date( new Date().getTime()); //??
        }
    },
    endTime:{
        type: DATE,
        allowNull: false,
        defaultValue: function(){
          return new Date( this.startTime + 1000*60*30);//?
        }
    }
})

Member.belongsTo(Member, { as: 'sponsor' });
Member.hasMany(Member, {foreignKey: 'sponsorId'});

Booking.belongsTo(Member, { as: 'bookedBy' });
Member.hasMany(Booking, {foreignKey: 'bookedById'});

Booking.belongsTo(Facility), {as: 'facility'};
Facility.hasMany(Booking, {foreignKey: 'facilityId'});


const syncAndSeed = async()=> {
    await conn.sync({ force: true });

    const [tennis, pingpong, raquetball, bowling] = await Promise.all(
        facilities.map(activity => Facility.create({activity})));

    const [lucy, moe, larry, ethyl] = await Promise.all(
        members.map(name => Member.create({name})));
    
}


syncAndSeed()