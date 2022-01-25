export const TRIGGERS = {
  DELETE: {
    action: 'DELETE',
    order: 'BEFORE',
    idFrom: 'OLD',
  },
  UPDATE: {
    action: 'UPDATE',
    order: 'AFTER',
    idFrom: 'NEW',
  },
  INSERT: {
    action: 'INSERT',
    order: 'AFTER',
    idFrom: 'NEW',
  },
};

export const getTriggerQueries = ({ trigger, dbName, dbTable }) => {
  const triggerName = `${trigger.order.toLowerCase()}_${dbTable}_${trigger.action.toLowerCase()}`;
  const queries = [];
  queries.push(`DROP TRIGGER IF EXISTS \`${triggerName}\`;`);
  queries.push(
    `CREATE TRIGGER \`${triggerName}\` 
    ${trigger.order} ${trigger.action} ON \`${dbName}\`.\`${dbTable}\` 
    FOR EACH ROW
    INSERT INTO \`u15824_logs\`.\`db_change_log\` (\`action\`,\`db\`,\`db_table\`,\`primary_key\`) 
    VALUES (
      '${trigger.action.toLowerCase()}',
      DATABASE(),
      '${dbTable}',
      ${trigger.idFrom}.id
    );`
      .replace(/\n/g, ' ')
      .replace(/\s+/g, ' ')
  );

  return queries;
};
