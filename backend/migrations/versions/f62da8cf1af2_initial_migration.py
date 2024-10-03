"""Initial migration.

Revision ID: f62da8cf1af2
Revises: 
Create Date: 2024-10-02 22:50:04.401402

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'f62da8cf1af2'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('existing_value',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('value', sa.String(length=80), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('existing_value')
    # ### end Alembic commands ###
